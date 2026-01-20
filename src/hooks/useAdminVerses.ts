import { useState, useCallback, useEffect } from 'react';
import { adminService, type PendingVerse, type PaginationParams, type PaginatedResponse, type UpdateVerseData } from '../services/admin';

export function useAdminVerses(initialParams: PaginationParams = {}) {
  const [verses, setVerses] = useState<PendingVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState<PaginatedResponse<PendingVerse>['meta']>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'asc',
    ...initialParams,
  });

  const fetchVerses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: any = await adminService.getPendingVerses({
        page: params.page,
        limit: params.limit
      });
      
      setVerses(response.verses || []);
      
      const apiPagination = response.pagination || {};
      
      setPagination({
        total: Number(apiPagination.total) || 0,
        page: Number(apiPagination.page) || 1,
        limit: Number(apiPagination.limit) || 10,
        totalPages: Number(apiPagination.totalPages) || 0,
        hasNext: (Number(apiPagination.page) < Number(apiPagination.totalPages)),
        hasPrev: (Number(apiPagination.page) > 1),
      });

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao carregar versículos pendentes';
      setError(errorMessage);
      console.error('Erro ao buscar versículos:', err);
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit]);

  const approveVerse = useCallback(async (id: string, lesson?: string) => {
    try {
      setActionLoading(true);
      await adminService.updateVerseApproval(id, true, lesson);

      setVerses(prev => prev.filter(v => v.id !== id));
      setPagination(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao aprovar versículo';
      setError(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const rejectVerse = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      await adminService.updateVerseApproval(id, false);
      setVerses(prev => prev.filter(v => v.id !== id));
      setPagination(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao rejeitar versículo';
      setError(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateVerseData = useCallback(async (id: string, verseData: UpdateVerseData) => {
    try {
      setActionLoading(true);
      const updatedVerse = await adminService.updateVerse(id, verseData);
      
      setVerses(prev => prev.map(v => v.id === id ? updatedVerse : v));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Erro ao atualizar' };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const setPage = useCallback((page: number) => setParams(p => ({ ...p, page })), []);
  const setLimit = useCallback((limit: number) => setParams(p => ({ ...p, limit, page: 1 })), []);
  const setSearch = useCallback((search: string) => setParams(p => ({ ...p, search, page: 1 })), []);

  useEffect(() => {
    fetchVerses();
  }, [fetchVerses]);

  return {
    verses,
    loading,
    actionLoading,
    error,
    pagination,
    params,
    approveVerse,
    rejectVerse,
    updateVerseData,
    setPage,
    setLimit,
    setSearch,
    clearError: () => setError(null),
    refresh: fetchVerses
  };
}
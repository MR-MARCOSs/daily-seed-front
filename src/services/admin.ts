import { api } from "./api";

export interface PendingVerse {
  id: string;
  text: string;
  book: string;
  chapter: number;
  from: number;
  to: number | null;
  lesson: string;
  approved: boolean;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
  };
}

export interface UpdateVerseApproval {
  approved: boolean;
}

export interface UpdateVerseData {
  lesson?: string;
  text?: string;
  book?: string;
  chapter?: number;
  from?: number;
  to?: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  approved?: boolean;
}

class AdminService {
  async getPendingVerses(params: PaginationParams = {}): Promise<PaginatedResponse<PendingVerse>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.search) queryParams.append('search', params.search);
    if (params.approved !== undefined) queryParams.append('approved', params.approved.toString());

    const { data } = await api.get<PaginatedResponse<PendingVerse>>(
      `/admin/verses/pending?${queryParams.toString()}`
    );
    return data;
  }

    async updateVerseApproval(id: string, approved: boolean, lesson?: string) {
      const body = { approved, ...(lesson && { lesson }) };
      const response = await api.patch(`/admin/verses/${id}/approve`, body);
      return response.data;
    }

  async updateVerse(id: string, verseData: UpdateVerseData): Promise<PendingVerse> {
    const { data } = await api.put<PendingVerse>(`/admin/verses/${id}`, verseData);
    return data;
  }

  async deleteVerse(id: string): Promise<void> {
    await api.delete(`/admin/verses/${id}`);
  }

  async getVerseById(id: string): Promise<PendingVerse> {
    const { data } = await api.get<PendingVerse>(`/admin/verses/${id}`);
    return data;
  }
}

export const adminService = new AdminService();
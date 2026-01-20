import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Loading from '../../components/Loading';
import { useAdminVerses } from '../../hooks/useAdminVerses';
import { type PendingVerse, type UpdateVerseData } from '../../services/admin';
import AdminEditModal from '../../components/AdminEditModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ApprovalModalProps {
  verse: PendingVerse;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, lesson: string) => Promise<void>;
  isProcessing: boolean;
}

const ApprovalModal = ({ verse, isOpen, onClose, onConfirm, isProcessing }: ApprovalModalProps) => {
  const [lesson, setLesson] = useState(verse.lesson || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aprovar Versículo
          </h3>
          <button onClick={onClose} className="text-green-600 hover:text-green-800">✕</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Referência & Texto</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="font-bold text-gray-900 text-sm mb-1">
                {verse.book} {verse.chapter}:{verse.from}{verse.to && verse.to !== verse.from ? `-${verse.to}` : ''}
              </p>
              <p className="text-gray-600 text-sm italic">"{verse.text}"</p>
            </div>
          </div>

          <div>
            <label htmlFor="modal-lesson" className="block text-sm font-medium text-gray-700 mb-1">
              Editar Lição (Obrigatório para exibição correta)
            </label>
            <textarea
              id="modal-lesson"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="Digite a lição que este versículo ensina..."
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(verse.id, lesson)}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium text-sm shadow-sm"
          >
            {isProcessing ? 'Aprovando...' : 'Confirmar Aprovação'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const {
    verses,
    loading,
    actionLoading,
    error,
    pagination,
    setPage,
    clearError,
    approveVerse,
    rejectVerse,
    updateVerseData
  } = useAdminVerses();

  const [verseToApprove, setVerseToApprove] = useState<PendingVerse | null>(null);
  const [verseToEdit, setVerseToEdit] = useState<PendingVerse | null>(null);
  const [verseToReject, setVerseToReject] = useState<string | null>(null);

  const openApprovalModal = (verse: PendingVerse) => {
    setVerseToApprove(verse);
  };

  const handleConfirmApproval = async (id: string, lesson: string) => {
    const success = await approveVerse(id, lesson);
    if (success) {
      setVerseToApprove(null);
    }
  };

  const handleConfirmReject = async (id: string) => {
    const success = await rejectVerse(id);
    if (success) {
      setVerseToReject(null);
    }
  };

  const handleSaveFullEdit = async (verseData: UpdateVerseData) => {
    if (!verseToEdit) return { success: false, error: 'Nenhum versículo' };
    
    const result = await updateVerseData(verseToEdit.id, verseData);
    if (result.success) {
      setVerseToEdit(null);
    }
    return result;
  };

  const formatReference = (verse: PendingVerse) => {
    const base = `${verse.book} ${verse.chapter}:${verse.from}`;
    return (verse.to && verse.to !== verse.from) ? `${base}-${verse.to}` : base;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yy HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (loading && verses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header /><main className="flex-grow flex items-center justify-center"><Loading /></main><Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Painel de Aprovação</h1>
            <p className="text-gray-500 mt-1">Gerencie os versículos enviados pela comunidade</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Pendentes</span>
                <span className="text-lg font-bold text-gray-800">{pagination.total}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Referência</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Texto e Lição</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enviado em</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {verses.length > 0 ? verses.map((verse) => (
                  <tr key={verse.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                        {formatReference(verse)}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900 italic font-serif">"{verse.text}"</p>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase mt-0.5">Lição:</span>
                          <p className="text-sm text-gray-700 font-medium bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 w-full">
                            {verse.lesson || <span className="text-gray-400 font-normal italic">Sem lição definida</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span className="text-sm text-gray-500">{formatDate(verse.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openApprovalModal(verse)}
                          className="group/btn flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="Revisar e Aprovar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setVerseToEdit(verse)}
                          className="group/btn flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Editar Texto/Referência"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setVerseToReject(verse.id)}
                          className="group/btn flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Rejeitar (Excluir)"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900">Nenhum versículo pendente</p>
                        <p className="text-sm text-gray-500">Bom trabalho! Todos os itens foram processados.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pagination.total > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Página <span className="font-medium text-gray-900">{pagination.page}</span> de <span className="font-medium text-gray-900">{pagination.totalPages}</span>
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {verseToApprove && (
        <ApprovalModal
          verse={verseToApprove}
          isOpen={true}
          isProcessing={actionLoading}
          onClose={() => setVerseToApprove(null)}
          onConfirm={handleConfirmApproval}
        />
      )}
      {verseToEdit && (
        <AdminEditModal
          verse={verseToEdit}
          onSave={handleSaveFullEdit}
          onClose={() => setVerseToEdit(null)}
        />
      )}
      {verseToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rejeitar Versículo?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Esta ação <strong>excluirá permanentemente</strong> o versículo do banco de dados. Tem certeza?
              </p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setVerseToReject(null)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConfirmReject(verseToReject)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm"
                >
                  {actionLoading ? 'Excluindo...' : 'Sim, Rejeitar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
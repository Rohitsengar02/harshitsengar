"use client";

import { useState, useEffect } from 'react';
import { getContactMessages, markMessageAsRead, deleteMessage } from '@/lib/firebase';
import { ContactForm } from '@/types';
import { AlertCircle, Trash2, Mail, MailOpen, Calendar, User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactForm | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await getContactMessages();
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDeleteClick = (id: string) => {
    setMessageToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    
    setDeleting(true);
    try {
      await deleteMessage(messageToDelete);
      
      // Optimistic UI update
      setMessages(messages.filter(message => message.id !== messageToDelete));
      setMessageToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Failed to delete message. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setMessageToDelete(null);
    setShowDeleteModal(false);
  };

  const handleViewMessage = async (message: ContactForm) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    
    // Mark as read if not already read
    if (!message.read && message.id) {
      try {
        await markMessageAsRead(message.id);
        
        // Update the message in the local state
        setMessages(messages.map(msg => 
          msg.id === message.id ? { ...msg, read: true, readAt: new Date().toISOString() } : msg
        ));
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleCloseMessageModal = () => {
    setSelectedMessage(null);
    setShowMessageModal(false);
  };

  const formatMessageDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    try {
      // For Firestore timestamps that have a toDate method
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage messages from your contact form
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No messages found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    From
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Received
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                      !message.read ? 'font-medium' : ''
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.read ? (
                        <div className="flex items-center">
                          <MailOpen size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Read</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Mail size={16} className="text-primary mr-2" />
                          <span className="text-primary font-medium text-sm">Unread</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{message.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 ml-1">({message.email})</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{message.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatMessageDate(message.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(message.id || '');
                        }}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message View Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {selectedMessage.subject}
              </h3>
              <button
                onClick={handleCloseMessageModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <User size={16} className="text-gray-500 dark:text-gray-400" />
                <div>
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">From: </span>
                  <span className="text-sm text-gray-800 dark:text-gray-100">{selectedMessage.name} ({selectedMessage.email})</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                <div>
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Received: </span>
                  <span className="text-sm text-gray-800 dark:text-gray-100">{formatMessageDate(selectedMessage.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-2">
                <MessageSquare size={16} className="text-gray-500 dark:text-gray-400 mt-1" />
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Message:</span>
              </div>
              <div className="pl-8 text-gray-800 dark:text-gray-100 whitespace-pre-line">
                {selectedMessage.message}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseMessageModal}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCloseMessageModal();
                  if (selectedMessage.id) {
                    handleDeleteClick(selectedMessage.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

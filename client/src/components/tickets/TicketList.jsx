import { useState, useEffect } from 'react';

const TicketList = ({ isAuthenticated }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  const fetchTickets = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/tickets');
      const data = await response.json();
      setTickets(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tickets');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">Please sign in to view your tickets</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {ticket.description}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status}
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
              <span>#{ticket.id}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    open: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-gray-100 text-gray-800',
    closed: 'bg-red-100 text-red-800',
  };
  return colors[status.toLowerCase()] || colors.open;
};

export default TicketList;
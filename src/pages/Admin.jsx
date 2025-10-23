import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Admin() {
  const { fetchWithAuth } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalTransactions: 0,
    totalReports: 0,
  });

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [statsRes, usersRes, itemsRes, txRes, reportsRes] = await Promise.all([
        fetchWithAuth(`${BACKEND_URL}/api/admin/get-stats`),
        fetchWithAuth(`${BACKEND_URL}/api/admin/users`),
        fetchWithAuth(`${BACKEND_URL}/api/admin/items`),
        fetchWithAuth(`${BACKEND_URL}/api/admin/transactions`),
        fetchWithAuth(`${BACKEND_URL}/api/admin/reports`),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const itemsData = await itemsRes.json();
      const txData = await txRes.json();
      const reportsData = await reportsRes.json();

      setStats(statsData);
      setUsers(usersData);
      setItems(itemsData);
      setTransactions(txData);
      setReports(reportsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetchWithAuth(`${BACKEND_URL}/api/admin/users/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setUsers(users.filter((user) => user._id !== id));
        }
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetchWithAuth(`${BACKEND_URL}/api/admin/items/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setItems(items.filter((item) => item._id !== id));
        }
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleResolveReport = async (id) => {
    if (window.confirm('Are you sure you want to resolve this report?')) {
      try {
        const res = await fetchWithAuth(`${BACKEND_URL}/api/admin/reports/${id}/resolve`, {
          method: 'POST',
        });
        if (res.ok) {
          setReports(reports.filter((report) => report._id !== id));
        }
      } catch (err) {
        console.error('Error resolving report:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background font-sans">
        <Header />
        <main className="flex-1 transition-all duration-300 pt-20">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 transition-all duration-300 pt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold text-foreground mb-12">Admin Dashboard</h1>

          {/* Statistics Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-foreground/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalUsers}</div>
                <div className="text-foreground/70 font-medium">Total Users</div>
              </div>

              <div className="bg-white border border-foreground/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalItems}</div>
                <div className="text-foreground/70 font-medium">Total Items</div>
              </div>

              <div className="bg-white border border-foreground/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats.totalTransactions}
                </div>
                <div className="text-foreground/70 font-medium">Total Transactions</div>
              </div>

              <div className="bg-white border border-foreground/10 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalReports}</div>
                <div className="text-foreground/70 font-medium">Reports Received</div>
              </div>
            </div>
          </section>

          {/* User Management Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">User Management</h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-foreground/10 shadow-sm">
              <table className="w-full">
                <thead className="bg-foreground/5 border-b border-foreground/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-foreground/5 hover:bg-foreground/2 transition"
                      >
                        <td className="px-6 py-4 text-sm text-foreground/70 truncate">
                          {user._id}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{user.email || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-foreground/50">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Item Management Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Item Management</h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-foreground/10 shadow-sm">
              <table className="w-full">
                <thead className="bg-foreground/5 border-b border-foreground/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-foreground/5 hover:bg-foreground/2 transition"
                      >
                        <td className="px-6 py-4 text-sm text-foreground/70 truncate">
                          {item._id}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {item.categoryId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {item.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-foreground/50">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Transaction History Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Transaction History</h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-foreground/10 shadow-sm">
              <table className="w-full">
                <thead className="bg-foreground/5 border-b border-foreground/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Donor ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Item ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="border-b border-foreground/5 hover:bg-foreground/2 transition"
                      >
                        <td className="px-6 py-4 text-sm text-foreground/70 truncate">{tx._id}</td>
                        <td className="px-6 py-4 text-sm text-foreground/70 truncate">
                          {tx.donorid || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground/70 truncate">
                          {tx.itemId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-primary">
                          ${tx.amount?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-foreground/50">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Report Management Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Report Management</h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-foreground/10 shadow-sm">
              <table className="w-full">
                <thead className="bg-foreground/5 border-b border-foreground/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Reported By
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Issue
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <tr
                        key={report._id}
                        className="border-b border-foreground/5 hover:bg-foreground/2 transition"
                      >
                        <td className="px-6 py-4 text-sm text-foreground/70 truncate">
                          {report._id}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {report.reportedBy || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {report.description || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleResolveReport(report._id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-foreground/50">
                        No reports found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

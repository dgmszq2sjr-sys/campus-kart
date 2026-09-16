import React, { useMemo, useState } from 'react';
import ReportModal from './components/ReportModal';

export default function App() {
  const allowedEmailPattern = /^[a-z][a-z0-9_-]*\.cse2025@citchennai\.net$/i;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [authMode, setAuthMode] = useState('signup');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState(
    () => localStorage.getItem('campusKartEmail') || ''
  );
  const [authMessage, setAuthMessage] = useState('');
  const [authMessageType, setAuthMessageType] = useState('error');
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('campusKartUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('campusKartForumComments');
    return savedComments
      ? JSON.parse(savedComments)
      : [
          {
            id: 1,
            author: 'admin.cse2025@citchennai.net',
            text: 'Welcome to the Campus Kart discussion board. Share item requests, rental updates, and safety notes here.',
            postedAt: 'Today'
          }
        ];
  });

  const isSignedIn = Boolean(currentUserEmail);

  // Dummy list of items rented out by students
  const rentedItems = [
    {
      id: 12,
      title: "Electric Kettle (1.5L)",
      renterEmail: "mike.cse2025@citchennai.net",
      dailyRate: 40,
      rentedDate: "2026-08-01"
    },
    {
      id: 15,
      title: "Engineering Physics Textbook",
      renterEmail: "sarah.cse2025@citchennai.net",
      dailyRate: 20,
      rentedDate: "2026-08-05"
    }
  ];

  const forumSubtitle = useMemo(() => {
    return comments.length === 1
      ? '1 public comment'
      : `${comments.length} public comments`;
  }, [comments.length]);

  const resetAuthNotice = () => {
    setAuthMessage('');
    setAuthMessageType('error');
  };

  const handleSignUp = (event) => {
    event.preventDefault();

    const normalizedEmail = emailInput.trim().toLowerCase();
    const cleanName = nameInput.trim();

    if (!cleanName) {
      setAuthMessageType('error');
      setAuthMessage('Enter your name to create an account.');
      return;
    }

    if (!allowedEmailPattern.test(normalizedEmail)) {
      setAuthMessageType('error');
      setAuthMessage('Use your CITCHENNAI CSE 2025 email, like name.cse2025@citchennai.net.');
      return;
    }

    if (passwordInput.length < 6) {
      setAuthMessageType('error');
      setAuthMessage('Create a password with at least 6 characters.');
      return;
    }

    if (registeredUsers.some((user) => user.email === normalizedEmail)) {
      setAuthMessageType('error');
      setAuthMessage('This email is already signed up. Please sign in.');
      setAuthMode('signin');
      return;
    }

    const nextUsers = [
      ...registeredUsers,
      {
        name: cleanName,
        email: normalizedEmail,
        password: passwordInput
      }
    ];

    localStorage.setItem('campusKartUsers', JSON.stringify(nextUsers));
    setRegisteredUsers(nextUsers);
    setAuthMode('signin');
    setPasswordInput('');
    setAuthMessageType('success');
    setAuthMessage('Account created. Sign in with your email and password.');
  };

  const handleSignIn = (event) => {
    event.preventDefault();

    const normalizedEmail = emailInput.trim().toLowerCase();

    if (!allowedEmailPattern.test(normalizedEmail)) {
      setAuthMessageType('error');
      setAuthMessage('Use your CITCHENNAI CSE 2025 email, like name.cse2025@citchennai.net.');
      return;
    }

    const matchingUser = registeredUsers.find((user) => user.email === normalizedEmail);

    if (!matchingUser) {
      setAuthMessageType('error');
      setAuthMessage('No account found for this email. Please sign up first.');
      setAuthMode('signup');
      return;
    }

    if (matchingUser.password !== passwordInput) {
      setAuthMessageType('error');
      setAuthMessage('Incorrect password. Please try again.');
      return;
    }

    localStorage.setItem('campusKartEmail', normalizedEmail);
    setCurrentUserEmail(normalizedEmail);
    setAuthMessage('');
    setPasswordInput('');
  };

  const handleSignOut = () => {
    localStorage.removeItem('campusKartEmail');
    setCurrentUserEmail('');
    setEmailInput('');
    setPasswordInput('');
    resetAuthNotice();
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    const cleanComment = commentText.trim();
    if (!cleanComment) return;

    const nextComments = [
      {
        id: Date.now(),
        author: currentUserEmail,
        text: cleanComment,
        postedAt: new Date().toLocaleString([], {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      },
      ...comments
    ];

    setComments(nextComments);
    localStorage.setItem('campusKartForumComments', JSON.stringify(nextComments));
    setCommentText('');
  };

  const handleOpenReport = (item) => {
    setSelectedListing(item);
    setIsModalOpen(true);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8 font-sans text-left">
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
          <section className="grid w-full overflow-hidden rounded-lg bg-white shadow-lg md:grid-cols-[1fr_1.15fr]">
            <div className="bg-emerald-700 p-8 text-white md:p-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
                Campus Kart
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                Student access for CSE 2025
              </h1>
              <p className="mt-4 text-sm leading-6 text-emerald-50">
                Sign up with your official CITCHENNAI CSE 2025 email, then sign in
                to view rentals, submit reports, and join the public discussion forum.
              </p>
            </div>

            <div className="p-8 md:p-10">
              <div className="grid grid-cols-2 rounded border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    resetAuthNotice();
                  }}
                  className={`rounded px-3 py-2 text-sm font-bold transition ${
                    authMode === 'signup'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    resetAuthNotice();
                  }}
                  className={`rounded px-3 py-2 text-sm font-bold transition ${
                    authMode === 'signin'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                {authMode === 'signup' ? 'Create Account' : 'Student Sign In'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Only emails in the format name.cse2025@citchennai.net are accepted.
              </p>

              <form onSubmit={authMode === 'signup' ? handleSignUp : handleSignIn} className="mt-6 space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={nameInput}
                      onChange={(event) => setNameInput(event.target.value)}
                      placeholder="Your name"
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    College email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    placeholder="name.cse2025@citchennai.net"
                    className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    placeholder={authMode === 'signup' ? 'Create a password' : 'Enter your password'}
                    className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                {authMessage && (
                  <p className={`rounded border px-3 py-2 text-sm font-medium ${
                    authMessageType === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}>
                    {authMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                >
                  {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-left">
      {/* Navigation Header */}
      <header className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Campus Kart</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            Logged in as: {currentUserEmail}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Items Currently On Rent</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rentedItems.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Rented to: <span className="font-semibold text-gray-800">{item.renterEmail}</span></p>
                    <p className="text-sm text-gray-600">Rate: ₹{item.dailyRate}/day</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded font-semibold">Active</span>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-end">
                  <button
                    onClick={() => handleOpenReport(item)}
                    className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white transition-colors"
                  >
                    🚩 Report Misuse / Damage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow">
          <div className="flex flex-col gap-1 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Public Discussion Forum</h2>
              <p className="text-sm text-gray-500">{forumSubtitle}</p>
            </div>
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-700">
              Add a comment
            </label>
            <textarea
              id="comment"
              rows="4"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Ask about rentals, share updates, or start a campus discussion."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Post Comment
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-3">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold text-gray-900">{comment.author}</p>
                  <p className="text-xs font-medium text-gray-500">{comment.postedAt}</p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">{comment.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Misuse Modal Popup */}
      {selectedListing && (
        <ReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          listingId={selectedListing.id}
          offenderEmail={selectedListing.renterEmail}
          reporterEmail={currentUserEmail}
        />
      )}
    </div>
  );
}

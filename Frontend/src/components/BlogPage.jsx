import React, { useState, useRef } from "react";
import {
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  User,
  Calendar,
  Eye,
  Code,
  Plus,
  X,
  Edit3,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
} from "lucide-react";
import Alert from "./Alert";

const BlogPage = () => {
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });

  const [currentUser] = useState("Current User"); // Simulated current user
  const [expandedBlogs, setExpandedBlogs] = useState(new Set());
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [editingBlog, setEditingBlog] = useState(null);

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Understanding Binary Search Algorithm",
      content:
        "Binary search is one of the most fundamental algorithms in computer science. It works by repeatedly dividing the search interval in half, making it incredibly efficient with O(log n) time complexity.\n\nThe key requirement is that the array must be sorted. Here's how it works:\n1. Compare the target with the middle element\n2. If equal, we're done\n3. If target is smaller, search left half\n4. If target is larger, search right half\n\nThis simple yet powerful approach makes binary search essential for any programmer's toolkit. Binary search demonstrates the power of divide-and-conquer algorithms and serves as a foundation for more complex data structures like binary search trees.\n\nImplementation tips:\n- Always check for edge cases (empty array, single element)\n- Be careful with integer overflow when calculating mid\n- Consider iterative vs recursive approaches\n- Practice with different variations (first/last occurrence, rotated arrays)",
      author: "Current User",
      date: "2025-06-28",
      likes: 24,
      comments: 8,
      views: 156,
      tags: ["Algorithm", "Search", "Binary Search"],
      liked: false,
      bookmarked: false,
    },
    {
      id: 2,
      title: "Mastering Dynamic Programming: A Beginner's Guide",
      content:
        "Dynamic Programming (DP) can seem intimidating at first, but it's essentially about breaking down complex problems into simpler subproblems.\n\nThe two main approaches are:\n• Top-down (Memoization): Solve recursively and cache results\n• Bottom-up (Tabulation): Build solution iteratively\n\nClassic examples include:\n- Fibonacci sequence\n- Longest Common Subsequence\n- Knapsack problem\n\nThe key insight is identifying overlapping subproblems and optimal substructure. Once you recognize the pattern, DP becomes a powerful problem-solving tool.",
      author: "Sarah Chen",
      date: "2025-06-27",
      likes: 18,
      comments: 12,
      views: 203,
      tags: ["Algorithm", "Dynamic Programming", "Optimization"],
      liked: true,
      bookmarked: false,
    },
    {
      id: 3,
      title: "Graph Traversal Algorithms: DFS vs BFS",
      content:
        "Graph traversal is fundamental to many algorithms and applications. The two primary methods are Depth-First Search (DFS) and Breadth-First Search (BFS).\n\nDFS explores as far as possible along each branch before backtracking:\n- Uses a stack (or recursion)\n- Good for topological sorting, cycle detection\n- Memory efficient for deep graphs\n\nBFS explores all neighbors at the current depth before moving deeper:\n- Uses a queue\n- Finds shortest path in unweighted graphs\n- Better for finding closest solutions\n\nChoosing between them depends on your specific problem requirements and graph characteristics.",
      author: "Current User",
      date: "2025-06-26",
      likes: 15,
      comments: 6,
      views: 134,
      tags: ["Graph", "DFS", "BFS", "Traversal"],
      liked: false,
      bookmarked: true,
    },
    {
      id: 4,
      title: "Time Complexity Analysis Made Simple",
      content:
        "Understanding time complexity is crucial for writing efficient algorithms. Big O notation helps us describe how algorithm performance scales with input size.\n\nCommon complexities:\n- O(1): Constant time - hash table lookups\n- O(log n): Logarithmic - binary search\n- O(n): Linear - array traversal\n- O(n log n): Linearithmic - efficient sorting\n- O(n²): Quadratic - nested loops\n\nTips for analysis:\n1. Focus on the dominant term\n2. Consider worst-case scenarios\n3. Ignore constants and lower-order terms\n4. Analyze loops and recursive calls\n\nMastering this concept will make you a better programmer and help in technical interviews.",
      author: "Mike Johnson",
      date: "2025-06-25",
      likes: 31,
      comments: 15,
      views: 287,
      tags: ["Complexity", "Big O", "Analysis", "Performance"],
      liked: false,
      bookmarked: false,
    },
  ]);

  const [comments, setComments] = useState({
    1: [
      {
        id: 1,
        author: "Mike Wilson",
        content:
          "Great explanation! Binary search is indeed fundamental. I'd love to see a follow-up on binary search trees.",
        date: "2025-06-28",
        likes: 3,
      },
      {
        id: 2,
        author: "Emma Davis",
        content:
          "The step-by-step breakdown really helped me understand the concept better. Thanks!",
        date: "2025-06-28",
        likes: 1,
      },
    ],
    2: [
      {
        id: 3,
        author: "John Smith",
        content:
          "DP was always confusing for me, but your explanation with examples makes it much clearer.",
        date: "2025-06-27",
        likes: 2,
      },
    ],
  });

  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});

  // Get user's blogs and public blogs
  const userBlogs = blogs.filter((blog) => blog.author === currentUser);
  const publicBlogs = blogs.filter((blog) => blog.author !== currentUser);

  const closeAlert = () => {
    setAlertConfig({
      ...alertConfig,
      isOpen: false,
    });
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const toggleExpandBlog = (blogId) => {
    const newExpanded = new Set(expandedBlogs);
    if (newExpanded.has(blogId)) {
      newExpanded.delete(blogId);
    } else {
      newExpanded.add(blogId);
      // Increment views when blog is expanded (read more)
      setBlogs(
        blogs.map((blog) =>
          blog.id === blogId ? { ...blog, views: blog.views + 1 } : blog
        )
      );
    }
    setExpandedBlogs(newExpanded);
  };

  const handleCreateBlog = () => {
    if (newBlog.title.trim() && newBlog.content.trim()) {
      const blog = {
        id: blogs.length + 1,
        title: newBlog.title,
        content: newBlog.content,
        author: currentUser,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        comments: 0,
        views: 0,
        tags: newBlog.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        liked: false,
        bookmarked: false,
      };
      setBlogs([blog, ...blogs]);
      setNewBlog({ title: "", content: "", tags: "" });
      setShowCreateBlog(false);
      setAlertConfig({
        isOpen: true,
        message: "Blog published successfully!",
        type: "success",
      });
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      content: blog.content,
      tags: blog.tags.join(", "),
    });
    setShowCreateBlog(true);
  };

  const handleUpdateBlog = () => {
    if (newBlog.title.trim() && newBlog.content.trim() && editingBlog) {
      setBlogs(
        blogs.map((blog) =>
          blog.id === editingBlog.id
            ? {
              ...blog,
              title: newBlog.title,
              content: newBlog.content,
              tags: newBlog.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag),
            }
            : blog
        )
      );
      setNewBlog({ title: "", content: "", tags: "" });
      setEditingBlog(null);
      setShowCreateBlog(false);
      setAlertConfig({
        isOpen: true,
        message: "Blog updated successfully!",
        type: "success",
      });
    }
  };

  const handleDeleteBlog = (blogId) => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to delete this blog?",
      type: "warning",
      customButtons: (
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => {
              setBlogs(blogs.filter((blog) => blog.id !== blogId));
              closeAlert();
              setAlertConfig({
                isOpen: true,
                message: "Blog deleted successfully!",
                type: "success",
              });
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Delete
          </button>
          <button
            onClick={closeAlert}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Cancel
          </button>
        </div>
      ),
    });
  };

  const handleLike = (blogId) => {
    // Only allow liking if blog is expanded (read more clicked)
    if (!expandedBlogs.has(blogId)) {
      setAlertConfig({
        isOpen: true,
        message: "Please read the full blog before liking!",
        type: "warning",
      });
      return;
    }

    setBlogs(
      blogs.map((blog) =>
        blog.id === blogId
          ? {
            ...blog,
            likes: blog.liked ? blog.likes - 1 : blog.likes + 1,
            liked: !blog.liked,
          }
          : blog
      )
    );
  };

  const handleShare = (blogId) => {
    // Only allow sharing if blog is expanded
    if (!expandedBlogs.has(blogId)) {
      setAlertConfig({
        isOpen: true,
        message: "Please read the full blog before sharing!",
        type: "warning",
      });
      return;
    }

    setAlertConfig({
      isOpen: true,
      message: "Blog link copied to clipboard!",
      type: "success",
    });
  };

  const handleBookmark = (blogId) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogId ? { ...blog, bookmarked: !blog.bookmarked } : blog
      )
    );
  };

  const handleAddComment = (blogId) => {
    const commentText = newComment[blogId];
    if (commentText && commentText.trim()) {
      const comment = {
        id:
          Math.max(
            ...Object.values(comments)
              .flat()
              .map((c) => c.id),
            0
          ) + 1,
        author: currentUser,
        content: commentText,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
      };

      setComments({
        ...comments,
        [blogId]: [...(comments[blogId] || []), comment],
      });

      setBlogs(
        blogs.map((blog) =>
          blog.id === blogId ? { ...blog, comments: blog.comments + 1 } : blog
        )
      );

      setNewComment({ ...newComment, [blogId]: "" });
    }
  };

  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to leave?",
      type: "warning",
      customButtons: (
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Leave
          </button>
          <button
            onClick={closeAlert}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Stay
          </button>
        </div>
      ),
    });
  };

  const toggleComments = (blogId) => {
    setShowComments({
      ...showComments,
      [blogId]: !showComments[blogId],
    });
  };

  const nextCarouselItem = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, userBlogs.length));
  };

  const prevCarouselItem = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + userBlogs.length) % Math.max(1, userBlogs.length)
    );
  };

  const renderBlogCard = (blog, isCarousel = false) => {
    const isExpanded = expandedBlogs.has(blog.id);
    const displayContent = isExpanded
      ? blog.content
      : truncateContent(blog.content);
    const shouldShowReadMore = blog.content.length > 200;

    return (
      <article
        key={blog.id}
        className={`bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden ${isCarousel ? "min-w-full" : ""
          }`}
      >
        {/* Blog Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{blog.author}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views} views</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isCarousel && blog.author === currentUser && (
                <>
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-700"
                    title="Edit blog"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-700"
                    title="Delete blog"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button className="text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">{blog.title}</h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-900 text-cyan-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-6">
          <div className="text-gray-300 leading-relaxed whitespace-pre-line">
            {displayContent}
          </div>
          {shouldShowReadMore && (
            <button
              onClick={() => toggleExpandBlog(blog.id)}
              className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>

        {/* Blog Actions */}
        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleLike(blog.id)}
                className={`flex items-center space-x-2 transition-colors ${blog.liked
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                  }`}
              >
                <Heart
                  className={`w-5 h-5 ${blog.liked ? "fill-current" : ""}`}
                />
                <span>{blog.likes}</span>
              </button>

              <button
                onClick={() => toggleComments(blog.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{blog.comments}</span>
              </button>

              <button
                onClick={() => handleShare(blog.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={() => handleBookmark(blog.id)}
              className={`transition-colors ${blog.bookmarked
                  ? "text-yellow-500"
                  : "text-gray-400 hover:text-yellow-500"
                }`}
            >
              <Bookmark
                className={`w-5 h-5 ${blog.bookmarked ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments[blog.id] && (
          <div className="border-t border-gray-700 bg-gray-750">
            {/* Add Comment */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment[blog.id] || ""}
                    onChange={(e) =>
                      setNewComment({
                        ...newComment,
                        [blog.id]: e.target.value,
                      })
                    }
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleAddComment(blog.id)}
                      disabled={!newComment[blog.id]?.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300"
                    >
                      <Send className="w-4 h-4" />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="p-6 space-y-6">
              {(comments[blog.id] || []).map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-white">
                        {comment.author}
                      </span>
                      <span className="text-sm text-gray-400">
                        {comment.date}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 pt-24">
        <div className="container mx-auto">
          <div className="relative flex items-center">
            {/* Back button - positioned absolutely */}
            <button
              onClick={handleBack}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center z-10"
              title="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>

            {/* Main header content - centered with padding to account for back button */}
            <div className="flex-1 px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex-1 ml-12">
                  <h1 className="text-3xl font-bold text-white">
                    AlgoViz Blog
                  </h1>
                  <p className="text-gray-400">
                    Share your algorithmic insights and learn from the community
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateBlog(true)}
                  className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Write Blog</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* User's Blogs Carousel */}
        {userBlogs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Blogs</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevCarouselItem}
                  disabled={userBlogs.length <= 1}
                  className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-400 text-sm">
                  {carouselIndex + 1} / {userBlogs.length}
                </span>
                <button
                  onClick={nextCarouselItem}
                  disabled={userBlogs.length <= 1}
                  className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {userBlogs.map((blog) => (
                  <div key={blog.id} className="w-full flex-shrink-0 pr-4">
                    {renderBlogCard(blog, true)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Blog Modal */}
        {showCreateBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateBlog(false);
                    setEditingBlog(null);
                    setNewBlog({ title: "", content: "", tags: "" });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newBlog.tags}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, tags: e.target.value })
                    }
                    placeholder="e.g., Algorithm, Data Structure, Binary Search"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newBlog.content}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, content: e.target.value })
                    }
                    placeholder="Write your blog content here... You can use line breaks for formatting."
                    rows={12}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowCreateBlog(false);
                    setEditingBlog(null);
                    setNewBlog({ title: "", content: "", tags: "" });
                  }}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingBlog ? handleUpdateBlog : handleCreateBlog}
                  disabled={!newBlog.title.trim() || !newBlog.content.trim()}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300"
                >
                  {editingBlog ? "Update Blog" : "Publish Blog"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Public Blogs Section */}
        <div className="space-y-8">
          {publicBlogs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Community Blogs
              </h2>
            </div>
          )}

          {publicBlogs.map((blog) => renderBlogCard(blog, false))}

          {publicBlogs.length === 0 && userBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No blogs yet
              </h3>
              <p className="text-gray-500 mb-6">
                Be the first to share your insights!
              </p>
              <button
                onClick={() => setShowCreateBlog(true)}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors duration-300"
              >
                Write Your First Blog
              </button>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {publicBlogs.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300">
              Load More Posts
            </button>
          </div>
        )}
      </div>

      <Alert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
        customButtons={alertConfig.customButtons}
      />
    </div>
  );
};

export default BlogPage;

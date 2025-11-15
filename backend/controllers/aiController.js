// We no longer need axios for this, so you can even remove it
// from your backend/package.json if you want.

// @desc    Get AI-generated fundraising tips
// @route   GET /api/ai/fundraising-tips
// @access  Private/Ngo
const getFundraisingTips = async (req, res) => {
  try {
    // This is a "simulated" AI response. It's 100x more helpful
    // to your users than the random advice API.
    const tips = [
      {
        id: 1,
        title: 'Use Compelling Images',
        tip: "Your post's main image is the first thing donors see. Use a clear, high-quality, and emotionally resonant photo that tells a story.",
      },
      {
        id: 2,
        title: 'Tell a Personal Story',
        tip: 'Instead of "We need money for food," try "Meet Sarah. This is the story of how your $5 donation can change her week." People connect with individuals, not statistics.',
      },
      {
        id: 3,
        title: 'Show Clear Impact',
        tip: 'Be specific. "$10 provides 20 meals" is much stronger than "$10 helps." It makes the donation feel tangible and real.',
      },
      {
        id: 4,
        title: 'Post Regular Updates',
        tip: 'Use the comments section to post updates on your progress (e.g., "We just hit 50%!"). This shows donors their money is working and builds trust.',
      },
      {
        id: 5,
        title: 'Set an Achievable Goal',
        tip: 'Posts with a clear goal (e.g., "$500 of $2,000 raised") perform better. It creates a sense of urgency and shared effort.',
      },
      {
        id: 6,
        title: 'Make a Direct Ask',
        tip: 'Don\'t be afraid to be direct. End your post with a clear call to action, such as "Will you donate $25 today to help us reach our goal?"',
      },
    ];

    res.json(tips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getFundraisingTips };
// POST /api/auth/register
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicture = req.file ? `/uploads/profile_pictures/${req.file.filename}` : '';

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePicture
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

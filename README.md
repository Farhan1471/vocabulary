# 📚 VocabMaster - 295 Essential Words with Bangla & Synonyms

A modern, responsive, and interactive vocabulary learning web application built with **Next.js 14**, **Tailwind CSS**, **FontAwesome**, and **HTML5**.

Designed specifically for mastering the 295 vocabulary words from `Vocabulary_List.docx` with easy Bangla meanings, synonyms, active recall flashcards, interactive quizzes, matching games, and native audio pronunciation.

---

## 🌟 Key Features

1. **Complete 295 Words Dataset**:
   - Every word includes English spelling, clear Bangla meaning (সহজ বাংলা অর্থ), and synonyms.
   - Categorized into **6 structured study sets** (~50 words each) for bite-sized learning.

2. **🔊 Web Speech Audio Pronunciation**:
   - One-click native English audio pronunciation for every word.

3. **🎴 3D Interactive Flashcards**:
   - Realistic 3D card flip animation.
   - "English First" or "Bangla First" flip toggle.
   - Shuffle cards and filter by Unmastered or Starred words.
   - Keyboard navigation support (`Space` to flip, `←`/`→` to navigate, `↑` for Mastered, `↓` for Review).

4. **🎯 3-Mode Vocabulary Quiz**:
   - **Mode 1**: English Word → Bangla Meaning
   - **Mode 2**: English Word → Synonym
   - **Mode 3**: Bangla Meaning → English Word
   - Instant feedback with explanation, streak counter, sound feedback, confetti celebration, and review of missed questions.

5. **🧩 Word Match Game**:
   - Pair English words with their corresponding Bangla meanings against a timer to sharpen memory retention.

6. **📊 Progress Tracking (Local Storage)**:
   - Tracks Mastered words, In-Progress words, Starred favorites, and Daily Study Streaks.

7. **🌓 Dark & Light Mode Support**:
   - High contrast, eye-friendly dark and light modes with smooth transitions.

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
# Visit http://localhost:3000
```

---

## 🌐 Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Fastest)

1. Open your terminal in this project folder (`c:\Users\farha\OneDrive\Desktop\vocabulary`).
2. Run login to connect your Vercel account:
   ```bash
   npx vercel login
   ```
3. Once logged in, run:
   ```bash
   npx vercel
   ```
4. Follow the brief prompts:
   - *Set up and deploy?* -> `Y`
   - *Which scope?* -> select your personal account
   - *Link to existing project?* -> `N`
   - *What's your project's name?* -> `vocabmaster` (or press Enter)
   - *In which directory is your code located?* -> `./` (press Enter)
   - *Want to modify build settings?* -> `N` (Next.js is auto-detected!)
5. To deploy straight to production:
   ```bash
   npx vercel --prod
   ```

### Option 2: Deploy via GitHub (Recommended for automatic continuous deployment)

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `vocabmaster`).
2. Push this local repository to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/vocabmaster.git
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new) and click **Import** next to your `vocabmaster` repository.
4. Click **Deploy**. Vercel will automatically build and give you a live production URL (e.g., `https://vocabmaster.vercel.app`) with automatic updates on every git push!

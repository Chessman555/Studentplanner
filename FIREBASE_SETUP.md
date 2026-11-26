# Optional Firebase setup — secure cloud login and syncing

Firebase is **not a GitHub API**. It's a separate service with a free Spark tier and quota limits. You do NOT need it for guest mode or the three public API features.

## Create your Firebase project

1. Go to https://console.firebase.google.com/ and sign in with your Google account.
2. Click **Add project**. Choose a name such as `studynest-school-project`. You can usually skip Google Analytics for this project.
3. Under your project, add a **Web app** (`</>` icon), nickname it `studynest-web`. You do not need Firebase Hosting because GitHub Pages already hosts your site.
4. Copy the **Firebase config object**, containing fields such as `apiKey`, `authDomain`, `projectId`, `messagingSenderId`, `appId`.
5. Open `firebase-config.js` in VS Code and replace the `null` export with your copied web configuration:

```js
export const firebaseConfig = {
  apiKey: "YOUR_PUBLIC_WEB_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

The Firebase **web config** identifies your public app; it is not a server secret. Never upload any Firebase **Admin SDK service account keys**, private keys, or GitHub personal access tokens to a GitHub Pages repository.

## Enable email/password sign-in

6. In Firebase Console, open **Build → Authentication → Get started**.
7. Open **Sign-in method → Email/Password**, switch on **Email/Password**, and save.
8. In **Authentication → Settings → Authorized domains**, add your GitHub Pages hostname, e.g. `YOUR-USERNAME.github.io`. If you test locally with Firebase, also authorize `localhost` as needed. GitHub's repository path (`/studynest`) is **not** part of the domain entry.

## Enable Firestore and add security rules

9. Open **Build → Firestore Database → Create database**. Choose a location near users. Start with restrictive production security rules, not a permanently open test database.
10. Select the **Rules** tab and use these rules (they restrict access to each user's own document):

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

11. Click **Publish** to apply the rules.
12. Upload your updated `firebase-config.js` to GitHub. GitHub Pages republishes the website.

## Test it

1. Open your hosted StudyNest website in a private/incognito window.
2. Click **Sign in with cloud account** → enter your email and a password (6+ chars) → **Create new account**.
3. Create a few assignments and notes.
4. Sign out; sign in with the same email/password. Confirm your data loads.
5. Open the site on another browser and sign in; confirm your cloud data loads there too.
6. Verify that different Firebase user accounts do **not** access each other's data.

## How cloud sync works here

- After sign-in, the site reads the document `students/{signedInUid}` in Firestore.
- Changes are saved (debounced) to the same user-owned document.
- Firestore rules restrict who can read/write the document. Authentication is handled by Firebase, not a handwritten browser password database.
- **Guest data is separate** from cloud data. Guest assignments are NOT automatically imported into a cloud account. To transfer, export the guest backup in Settings, sign in to cloud, and import the backup.
- This demo uses one Firestore document for the entire planner. Firestore documents have a **1 MiB size limit**; as notes/history grow, move to separate collections and pagination for production.
- The app does not implement live concurrent editing/merge conflict resolution; avoid opening the same account and editing simultaneously on many devices.
- Authentication and Firestore have free quotas, limits and billing policies that can change; consult https://firebase.google.com/pricing.
- Your Firestore rules, authentication methods, input validation, and project settings should be reviewed before any production deployment.

Official docs:
- https://firebase.google.com/docs/auth/web/start
- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/firestore/quotas

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Auto-install three.js if missing
try {
  require.resolve("three");
} catch (e) {
  console.log("[ViteConfig] three.js package not found. Installing...");
  try {
    execSync("npm install three @types/three --no-audit --no-fund", { stdio: "inherit" });
    console.log("[ViteConfig] Installed three.js and @types/three successfully!");
  } catch (installErr) {
    console.error("[ViteConfig] Failed to install three.js:", installErr);
  }
}

// Auto-install lenis if missing
try {
  require.resolve("lenis");
} catch (e) {
  console.log("[ViteConfig] lenis package not found. Installing...");
  try {
    execSync("npm install lenis --no-audit --no-fund", { stdio: "inherit" });
    console.log("[ViteConfig] Installed lenis successfully!");
  } catch (installErr) {
    console.error("[ViteConfig] Failed to install lenis:", installErr);
  }
}

// Auto-copy generated assets to public folder
try {
  const srcDir =
    "C:/Users/aryan/.gemini/antigravity-ide/brain/a4c4895d-4dce-4717-8d87-32ece6768228";
  const destDir = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const filesMap = {
    "agrishield_wild_boar_1785561757537.png": "agrishield_boar.png",
    "agrishield_thermal_camera_1785561772522.png": "agrishield_camera.png",
    "agrishield_village_community_1785561803915.png": "agrishield_village.png",
    "agrishield_deterrent_siren_1785561817414.png": "agrishield_siren.png",
  };
  Object.entries(filesMap).forEach(([srcName, destName]) => {
    const srcPath = path.join(srcDir, srcName);
    const destPath = path.join(destDir, destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[ViteConfig] Copied ${srcName} -> ${destName}`);
    }
  });
} catch (e) {
  console.error("[ViteConfig] Failed to copy images:", e);
}

export default defineConfig({
  plugins: [tanstackStart(), react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: true, // Listen on all network interfaces
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});

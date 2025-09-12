// Cloudflare Pages build configuration
module.exports = {
  pages: {
    build: {
      command: "cd frontend && npm install && npm run build",
      cwd: "frontend",
      output_dir: "dist"
    }
  }
};
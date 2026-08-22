module.exports = {
  apps: [
    {
      name: 'nmit-peoplehub-backend',
      script: './Servercopy.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster', // Enable cluster mode for load balancing
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Auto-restart configuration
      watch: false, // Set to true for development to watch file changes
      max_memory_restart: '1G', // Restart if memory exceeds 1GB
      
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true, // Prefix logs with time
      
      // Advanced features
      autorestart: true, // Auto restart on crash
      max_restarts: 10, // Maximum number of unstable restarts
      min_uptime: '10s', // Minimum uptime to not be considered unstable
      
      // Graceful shutdown
      kill_timeout: 5000, // Time to wait for graceful shutdown
      wait_ready: true, // Wait for app to be ready
      listen_timeout: 3000, // Time to wait for app to listen
      
      // Cron restart (optional - restart at 3 AM daily)
      // cron_restart: '0 3 * * *',
      
      // Merge logs from all instances
      merge_logs: true,
      
      // Source map support
      source_map_support: true,
      
      // Instance variables
      instance_var: 'INSTANCE_ID'
    }
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'node',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/nmit-peoplehub.git',
      path: '/var/www/hrms',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p logs'
    }
  }
};

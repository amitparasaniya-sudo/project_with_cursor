module.exports = {
  apps: [
    {
      name: 'crud-app',
      script: 'app.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Auto-restart settings
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced settings
      min_uptime: '10s',
      max_restarts: 10,
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Environment variables
      env_file: '.env'
    }
  ]
};

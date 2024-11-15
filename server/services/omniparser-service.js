// server/services/omniparser-service.js
const { spawn } = require('child_process');
const path = require('path');
const PYTHON_PATH = process.env.PYTHON_PATH || 'python3';

class OmniParserService {
  async analyze_image(imageUrl, question) {
    try {
      const pythonScript = path.join(process.cwd(), '..', 'python', 'main.py');
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn(PYTHON_PATH, [
          pythonScript,
          imageUrl,
          question
        ]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
          console.log('Python stdout:', data.toString());
          result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error('Python stderr:', data.toString());
          error += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              const parsed = JSON.parse(result);
              resolve(parsed.result);
            } catch (e) {
              console.error('JSON parse error:', e);
              reject(new Error('Failed to parse Python output'));
            }
          } else {
            console.error('Python error output:', error);
            reject(new Error('Image analysis failed'));
          }
        });

        pythonProcess.on('error', (err) => {
          console.error('Python process error:', err);
          reject(err);
        });
      });
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error('Image analysis failed');
    }
  }
}

module.exports = OmniParserService;
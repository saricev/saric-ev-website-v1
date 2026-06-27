import { appendFileSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'fs';
import { join } from 'path';

const LOG_DIR = join(process.cwd(), 'logs');
const RETENTION_DAYS = 30;

type LogLevel = 'ERROR' | 'WARN' | 'INFO';

const LOG_LEVELS: Record<LogLevel, number> = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
};

// In production, only log WARN and above. In dev, log everything.
const MAX_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'WARN' : 'INFO';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[MAX_LEVEL];
}

function getLogDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getTimestamp(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function ensureLogDir(): void {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
  } catch {
    // directory already exists
  }
}

function cleanupOldLogs(): void {
  try {
    const files = readdirSync(LOG_DIR);
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

    for (const file of files) {
      if (!file.endsWith('.log')) continue;
      const filePath = join(LOG_DIR, file);
      try {
        const stat = statSync(filePath);
        if (stat.mtimeMs < cutoff) {
          unlinkSync(filePath);
        }
      } catch {
        // skip files we can't access
      }
    }
  } catch {
    // log dir doesn't exist yet
  }
}

// Run cleanup once on module load
ensureLogDir();
cleanupOldLogs();

// Also cleanup every 24 hours
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);

function write(level: LogLevel, source: string, message: string, data?: unknown): void {
  if (!shouldLog(level)) return;

  const date = getLogDate();
  const timestamp = getTimestamp();
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  const line = `[${timestamp}] [${level}] [${source}] ${message}${dataStr}\n`;

  // Always write to console in dev
  if (process.env.NODE_ENV !== 'production') {
    const fn = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log;
    fn(line.trimEnd());
  }

  try {
    ensureLogDir();
    const logFile = join(LOG_DIR, `${date}.log`);
    appendFileSync(logFile, line, 'utf-8');
  } catch {
    // If file write fails, at least we logged to console
  }
}

export const logger = {
  error(source: string, message: string, data?: unknown) {
    write('ERROR', source, message, data);
  },
  warn(source: string, message: string, data?: unknown) {
    write('WARN', source, message, data);
  },
  info(source: string, message: string, data?: unknown) {
    write('INFO', source, message, data);
  },
};

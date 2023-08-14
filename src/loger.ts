import 'dotenv/config';
import intel from 'intel';
import fs from 'fs-extra';

let LOG_LEVEL = intel.INFO;

const LOG_LEVEL_MAP = {
  'TRACE': intel.TRACE,
  'VERBOSE': intel.VERBOSE,
  'DEBUG': intel.DEBUG,
  'INFO': intel.INFO,
  'WARN': intel.WARN,
  'ERROR': intel.ERROR,
  'CRITICAL': intel.CRITICAL
};

if(process.env.LOG_LEVEL in LOG_LEVEL_MAP){
  LOG_LEVEL = LOG_LEVEL_MAP[process.env.LOG_LEVEL];
}

intel.setLevel(LOG_LEVEL);

fs.ensureFileSync(process.env.LOG_FILE);

intel.addHandler(new intel.handlers.File(process.env.LOG_FILE));

const loger = intel;

export default loger;

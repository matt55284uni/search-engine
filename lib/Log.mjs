import colors from 'colors';

export const Log = {};
export default Log;

Log.update = function(process, subprocess, message, colour) {
    console.log(`[${colors[colour](process.toUpperCase().bold)} {${subprocess.toLowerCase().gray}}]: ${message}`);
}
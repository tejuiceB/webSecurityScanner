/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} username
 */

/**
 * @typedef {'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'} SeverityLevel
 */

/**
 * @typedef {Object} Vulnerability
 * @property {number} id
 * @property {string} name
 * @property {SeverityLevel} severity
 * @property {string} description
 * @property {string} [solution]
 */

/**
 * @typedef {Object} ScanResult
 * @property {number} id
 * @property {'in_progress' | 'completed' | 'failed'} status
 * @property {Vulnerability[]} vulnerabilities
 * @property {string} target_url
 * @property {string} scan_type
 * @property {string} start_time
 * @property {string} [end_time]
 */

/**
 * @typedef {Object} ApiError
 * @property {number} status
 * @property {string} message
 */

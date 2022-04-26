const MONGO_DB_URL = process.env.MONGO_DB_URL
const ENVIRONMENT = process.env.ENVIRONMENT
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY
const BOOTSTRAP_SERVERS = process.env.BOOTSTRAP_SERVERS
const SASL_USERNAME = process.env.SASL_USERNAME
const SASL_PASSWORD = process.env.SASL_PASSWORD
const SECURITY_PROTOCOL = process.env.SECURITY_PROTOCOL
const SASL_MECHANISMS = process.env.SASL_MECHANISMS
const SESSION_TIMEOUT_MS = process.env.SESSION_TIMEOUT_MS
const TOPICNAME = process.env.TOPICNAME
// const B2C_TENANT_NAME = process.env.B2C_TENANT_NAME
// const B2C_CLIENT_ID = process.env.B2C_CLIENT_ID
// const B2C_POLICY_NAME = process.env.B2C_POLICY_NAME
// const AZURE_STORAGE_NOTIFICATION_QUEUE_NAME = process.env.AZURE_STORAGE_NOTIFICATION_QUEUE_NAME
// const AZURE_STORAGE_EMAIL_QUEUE_NAME = process.env.AZURE_STORAGE_EMAIL_QUEUE_NAME
// const SENDERID = process.env.SENDERID
// const KNOWLARITYURL = process.env.KNOWLARITYURL
// const B2C_TENANT_ID = process.env.B2C_TENANT_ID
// const B2C_CLIENT_SECRET = process.env.B2C_CLIENT_SECRET
// const B2C_EXTENSION_ID = process.env.B2C_EXTENSION_ID
// const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
// const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL

export const CONFIG = {
  "MONGO_DB_URL": MONGO_DB_URL,
  "ENVIRONMENT": ENVIRONMENT,
  "AZURE_STORAGE_ACCOUNT_NAME": AZURE_STORAGE_ACCOUNT_NAME,
  "AZURE_STORAGE_ACCOUNT_KEY": AZURE_STORAGE_ACCOUNT_KEY,
  "BOOTSTRAP_SERVERS":BOOTSTRAP_SERVERS,
  "SASL_USERNAME":SASL_USERNAME,
  "SASL_PASSWORD":SASL_PASSWORD,
  "SECURITY_PROTOCOL":SECURITY_PROTOCOL,
  "SASL_MECHANISMS":SASL_MECHANISMS,
  "SESSION_TIMEOUT_MS":SESSION_TIMEOUT_MS,
  "TOPICNAME":TOPICNAME,
  // "AZURE_STORAGE_EMAIL_QUEUE_NAME": AZURE_STORAGE_EMAIL_QUEUE_NAME,
  // "AZURE_STORAGE_NOTIFICATION_QUEUE_NAME": AZURE_STORAGE_NOTIFICATION_QUEUE_NAME,
  // "SENDERID": SENDERID,
  // "KNOWLARITYURL": KNOWLARITYURL,
  // "B2C_TENANT_ID": B2C_TENANT_ID,
  // "B2C_CLIENT_SECRET": B2C_CLIENT_SECRET,
  // "B2C_CLIENT_ID": B2C_CLIENT_ID,
  // "B2C_EXTENSION_ID": B2C_EXTENSION_ID,
  // "SENDGRID_API_KEY": SENDGRID_API_KEY,
  // "SENDGRID_FROM_EMAIL": SENDGRID_FROM_EMAIL,

  //   b2cOptions: {
  //   identityMetadata: `https://${B2C_TENANT_NAME}.b2clogin.com/${B2C_TENANT_NAME}.onmicrosoft.com/${B2C_POLICY_NAME}/v2.0/.well-known/openid-configuration`,
  //   clientID: B2C_CLIENT_ID,
  //   audience: B2C_CLIENT_ID,
  //   policyName: B2C_POLICY_NAME,
  //   isB2C: true,
  //   validateIssuer: false,
  //   loggingLevel: 'info',
  //   passReqToCallback: false,
  // }
};

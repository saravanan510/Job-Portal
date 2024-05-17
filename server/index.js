const express = require("express");
const configureDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const { checkSchema } = require("express-validator");

const app = express();
const port = 4444;
app.use(cors());
app.use(express.json());
configureDB();

const userRegisterValidationSchema = require("./app/validations/user-register-validations");
const userLoginValidationSchema = require("./app/validations/user-login-validation");
const {
  candidateValidationSchema,
  candidateEditValidationSchema,
} = require("./app/validations/candidate-validation");
const {
  recruiterValidationSchema,
  recruiterEditValidationSchema,
} = require("./app/validations/recruiter-validation");
const jobValidationSchema = require("./app/validations/job-validation");
const {
  applicationValidationSchema,
} = require("./app/validations/application-validation");

const usersCltr = require("./app/controllers/users-cltr");
const jobsCltr = require("./app/controllers/jobs-cltr");
const candidatesCltr = require("./app/controllers/candidates-cltr");
const recruiterCltr = require("./app/controllers/recruiter-cltr");
const applicationsCltr = require("./app/controllers/applications-cltr");

const authenticateUser = require("./app/middlewares/authenticateUser");
const authorizeUser = require("./app/middlewares/authorizeUser");

// routes
app.post(
  "/users/register",
  checkSchema(userRegisterValidationSchema),
  usersCltr.register
);
app.post(
  "/users/login",
  checkSchema(userLoginValidationSchema),
  usersCltr.login
);
app.get("/users/checkemail", usersCltr.checkEmail);
app.get("/users/account", authenticateUser, usersCltr.account);

// Candidate

app.post(
  "/api/candidates/profile",
  authenticateUser,
  authorizeUser(["candidate"]),
  checkSchema(candidateValidationSchema),
  candidatesCltr.create
);
app.get(
  "/api/candidates/profile",
  authenticateUser,
  authorizeUser(["candidate"]),
  candidatesCltr.show
);

app.get(
  "/api/candidate/:id",
  authenticateUser,
  authorizeUser(["candidate", "recruiter"]),
  candidatesCltr.profile
);
app.put(
  "/api/candidates/profile",
  authenticateUser,
  authorizeUser(["candidate"]),
  checkSchema(candidateEditValidationSchema),
  candidatesCltr.update
);

// Recruiter

app.post(
  "/api/recruiters/profile",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(recruiterValidationSchema),
  recruiterCltr.create
);
app.get(
  "/api/recruiters/profile",
  authenticateUser,
  authorizeUser(["recruiter"]),
  recruiterCltr.show
);
app.put(
  "/api/recruiters/profile",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(recruiterEditValidationSchema),
  recruiterCltr.update
);

// Jobs

app.get("/api/jobs", jobsCltr.list);

app.get(
  "/api/jobs/my",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobsCltr.my
);
app.post(
  "/api/jobs",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(jobValidationSchema),
  jobsCltr.create
);
app.get("/api/jobs/:id", jobsCltr.show);
app.delete(
  "/api/jobs/:id",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobsCltr.remove
);
app.put(
  "/api/jobs/:id",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(jobValidationSchema),
  jobsCltr.update
);
//
app.get(
  "/api/jobs/:id/applications",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobsCltr.applications
);
app.get(
  "/api/jobs/:id/applications/:appId",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobsCltr.singleApplication
);
/// application

app.get(
  "/api/applications",
  authenticateUser,
  authorizeUser(["recruiter"]),
  applicationsCltr.list
);
app.post(
  "/api/applications",
  authenticateUser,
  authorizeUser(["candidate"]),
  checkSchema(applicationValidationSchema),
  applicationsCltr.apply
);
app.put(
  "/api/applications/:id",
  authenticateUser,
  authorizeUser(["recruiter"]),
  applicationsCltr.update
);
app.get(
  "/api/applications/check/:jobId",
  authenticateUser,
  authorizeUser(["candidate", "recruiter"]),
  applicationsCltr.check
);

app.listen(port, () => {
  console.log("server running successfully on port", port);
});

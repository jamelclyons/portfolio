import corsLib, { CorsOptions } from 'cors';

import * as functions from 'firebase-functions/v1';
import * as nodemailer from "nodemailer";

import { getData, postData } from './controllers/database';

import ResponseError from './model/ResponseError';

const getOrigin = (): string[] => {
  const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];

  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');

    const devOrigins = Object.keys(process.env)
      .filter((key) => key.startsWith('DEV_CORS_ORIGIN'))
      .map((key) => process.env[key])
      .filter(Boolean) as string[];

    return devOrigins.length > 0 ? devOrigins : defaultOrigins;
  } else {
    console.log('Running in production mode');

    const prodOrigins = Object.keys(process.env)
      .filter((key) => key.startsWith('CORS_ORIGIN'))
      .map((key) => process.env[key])
      .filter(Boolean) as string[];

    return prodOrigins.length > 0
      ? prodOrigins
      : process.env.CORS_ORIGIN
        ? [process.env.CORS_ORIGIN]
        : defaultOrigins;
  }
};

const printCORSOrigin = (url: string) => {
  console.log(`Server is now accepting request from ${url}`);
};

const origin = getOrigin();

if (Array.isArray(origin) && origin.length > 0) {
  origin.forEach((url) => {
    printCORSOrigin(url);
  });
}

if (typeof origin === 'string') {
  printCORSOrigin(origin);
}

const corsOptions: CorsOptions = {
  origin: origin,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Refresh-Token'],
};

const cors = corsLib(corsOptions);

export const check = functions.https.onRequest(async (req, res) => {
  try {
    console.log(req);
    // await checkToken(req);

    res.json({ success_message: 'Token is valid.' });
  } catch (error) {
    const err = error as ResponseError;

    res.json({
      error_message: err.message,
      status_code: err.statusCode,
    });
  }
});

export const project = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const projectID = req.params[0];
      const data = await getData('portfolio', projectID);

      if (data === null) {
        throw new ResponseError(`${projectID} could not be found.`, 404);
      }

      res.json({ data: data });
    } catch (error) {
      const err = error as ResponseError;

      res.json({
        error_message: err.message,
        status_code: err.statusCode,
      });
    }
  });
});

export const saveProject = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const id = req.params[0];

      let repoURL = null;

      if (req.body.process) {
        repoURL = req.body.process.development.repo_url;
      }

      const data = await postData('portfolio', id, req.body);

      if (!data) {
        throw new ResponseError(
          `Project with the #ID: ${id} could not be updated.`,
          400
        );
      }

      res.json({
        id: id,
        repo_url: repoURL,
        success_message: `Project with the #ID: ${id} was updated at ${data}.`,
      });
    } catch (error) {
      const err = error as ResponseError;

      res.json({
        error_message: err.message,
        status_code: err.statusCode,
      });
    }
  });
});

export const user = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const id = req.params[0];

      const data = await getData('user', id);

      if (data === null) {
        throw new ResponseError(`${id} could not be found.`, 404);
      }

      res.json({ data: data });
    } catch (error) {
      const err = error as ResponseError;

      res.json({
        error_message: err.message,
        status_code: err.statusCode,
      });
    }
  });
});

export const organization = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const id = req.params[0];

      const data = await getData('organization', id);

      if (data === null) {
        throw new ResponseError(`${id} could not be found.`, 404);
      }

      res.json({ data: data });
    } catch (error) {
      const err = error as ResponseError;

      res.json({
        error_message: err.message,
        status_code: err.statusCode,
      });
    }
  });
});

export const contact = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const body = req.body ?? null;

      let errorMessage = "";
      let successMessage = null;

      if (body == null) {
        errorMessage = "First name, last name, email, subject and message is required.";
      }

      const {
        contact_first_name,
        contact_last_name,
        contact_email,
        contact_subject,
        contact_message
      } = req.body;

      const firstName = contact_first_name?.trim ? contact_first_name : null;
      const lastName = contact_last_name?.trim ? contact_last_name : null;
      const contactEmail = contact_email?.trim ? contact_email : null;
      const subject = contact_subject?.trim ? contact_subject : null;
      const message = contact_message?.trim ? contact_message : null;

      if (!firstName) errorMessage += "First name is required. ";
      if (!lastName) errorMessage += "Last name is required. ";
      if (!contactEmail) errorMessage += "Email is required. ";
      if (!subject) errorMessage += "Subject is required. ";
      if (!message) errorMessage += "Message is required.";

      const email = "jamel.c.lyons@gmail.com";

      if (errorMessage == "") {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: email,
            pass: "oyfs gbev hdqq qznl",
          },
        });

        const messageSent = await transporter.sendMail({
          from: contactEmail,
          to: email,
          subject,
          text: message,
        });

        successMessage = messageSent.rejected.length == 0 ? `Your message has been sent successfully ${contact_first_name}, Thank You.` : null;
      }

      res.json({
        success: successMessage,
        error: errorMessage
      });
    } catch (error) {
      const err = error as ResponseError;

      res.json({
        error: err.message,
        status_code: err.statusCode,
      });
    }
  });
});
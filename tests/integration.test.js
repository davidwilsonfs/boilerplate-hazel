const axios = require("axios");
const { mockNote, mockNoteComplete } = require("./mocks");
const AWS = require("aws-sdk");

require("dotenv").config();
AWS.config.update({ region: "sa-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
// const tableName = process.env.NOTES_TABLE;
const tableName = "notes-backend-hazel-test";
// Não passsar esses dados em hard code, má prática
const domain =
  "https://mxb3sag7o3.execute-api.sa-east-1.amazonaws.com/test/notes";

let note;
let noteUpdate;
let createdNote;

describe("Notes endpoints - Tests Integration", () => {
  describe("POST /note", () => {
    beforeAll(async () => {
      jest.setTimeout(30000);
      note = mockNote();
    });

    afterAll(async () => {
      try {
        let note_id = createdNote.note_id;

        let params = {
          TableName: tableName,
          Key: {
            note_id: note_id
          }
        };
        await dynamodb.delete(params).promise();
      } catch (error) {
        console.log(error);
      }
    });

    test("Should save a note if it has been provided", async () => {
      const { data, status } = await axios.post(domain, note);
      createdNote = Object.assign({}, data);

      expect(status).toBe(201);
      expect(data).toBeTruthy();
      expect(data).toMatchObject(note);
      expect(data).toHaveProperty("note_id");
      expect(data).toHaveProperty("timestamp");
      expect(data).toHaveProperty("expires");
    });

    test("should return 400 if user_name has not been provided in note object", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        delete noteCopy.user_name;

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;

        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/user_name/));
        expect(data.message).toEqual(expect.stringMatching(/required/));
      }
    });

    test("should return 400 if text has not been provided in note object", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        delete noteCopy.text;

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/text/));
        expect(data.message).toEqual(expect.stringMatching(/required/));
      }
    });

    test("should return 400 if password has not been provided in note object", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        delete noteCopy.password;

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/password/));
        expect(data.message).toEqual(expect.stringMatching(/required/));
      }
    });

    test("should return 400 if invalid password has been provided in note object", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        noteCopy.password = "1234";

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/password/));
        expect(data.message).toEqual(expect.stringMatching(/pattern/));
      }
    });

    test("should return 400 if email has not been provided in note object", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        delete noteCopy.email;

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/email/));
        expect(data.message).toEqual(expect.stringMatching(/required/));
      }
    });

    test("should return 400 if invalid email has been provided in note object", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        noteCopy.email = "testando";

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/email/));
        expect(data.message).toEqual(
          expect.stringMatching(/must be a valid email/)
        );
      }
    });

    test("should return 400 if birthyear out of range less than min", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        noteCopy.birthyear = 1700;

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/birthyear/));
        expect(data.message).toEqual(
          expect.stringMatching(/must be larger than or equal to/)
        );
      }
    });

    test("should return 400 if birthyear out of range larger than max", async () => {
      try {
        let noteCopy = Object.assign({}, note);
        noteCopy.birthyear = 2040;

        await axios.post(domain, noteCopy);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/birthyear/));
        expect(data.message).toEqual(
          expect.stringMatching(/must be less than or equal to/)
        );
      }
    });
  });

  describe("GET /note/{note_id}", () => {
    beforeAll(async () => {
      jest.setTimeout(30000);
      note = mockNoteComplete();

      await dynamodb
        .put({
          TableName: tableName,
          Item: note
        })
        .promise();
    });

    afterAll(async () => {
      try {
        let note_id = note.note_id;

        let params = {
          TableName: tableName,
          Key: {
            note_id: note_id
          }
        };
        await dynamodb.delete(params).promise();
      } catch (error) {
        console.log(error);
      }
    });

    test("Should return a note if valid note_id has been provided", async () => {
      const { note_id } = note;
      const { status, data } = await axios.get(`${domain}/${note_id}`);
      expect(status).toBe(200);

      expect(data).toBeTruthy();
      expect(data).toMatchObject(note);
    });

    test("Should return 404 if invalid note_id has been provided", async () => {
      try {
        const note_id = "1";
        await axios.get(`${domain}/${note_id}`);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(404);
        expect(data.error).toEqual("NotFoundError");
        expect(data.message).toEqual(
          expect.stringMatching(/Note not found by note_id passed/)
        );
      }
    });
  });

  describe("UPDATE /note/{note_id}", () => {
    beforeAll(async () => {
      jest.setTimeout(30000);
      note = mockNoteComplete();
      noteUpdate = mockNote();
      delete noteUpdate.note_id;
      await dynamodb
        .put({
          TableName: tableName,
          Item: note
        })
        .promise();
    });

    afterAll(async () => {
      try {
        let note_id = note.note_id;

        let params = {
          TableName: tableName,
          Key: {
            note_id: note_id
          }
        };
        await dynamodb.delete(params).promise();
      } catch (error) {
        console.log(error);
      }
    });

    test("Should update a note if valid note_id and note object have been provided", async () => {
      const { note_id } = note;
      const { status, data } = await axios.patch(
        `${domain}/${note_id}`,
        noteUpdate
      );
      expect(status).toBe(200);

      expect(data).toBeTruthy();
      expect(data).toMatchObject(noteUpdate);
    });

    test("Should update a note if valid note_id and valid email have been provided", async () => {
      const { note_id } = note;
      const obj = {
        email: "testando@test.com"
      };
      const { status, data } = await axios.patch(`${domain}/${note_id}`, obj);
      expect(status).toBe(200);

      expect(data).toBeTruthy();
      expect(data).toMatchObject(obj);
    });

    test("Should update a note if valid note_id and valid text have been provided", async () => {
      const { note_id } = note;
      const obj = {
        text: "testing text"
      };
      const { status, data } = await axios.patch(`${domain}/${note_id}`, obj);
      expect(status).toBe(200);

      expect(data).toBeTruthy();
      expect(data).toMatchObject(obj);
    });

    test("Should update a note if valid note_id and valid user_name have been provided", async () => {
      const { note_id } = note;
      const obj = {
        user_name: "Testando"
      };
      const { status, data } = await axios.patch(`${domain}/${note_id}`, obj);
      expect(status).toBe(200);

      expect(data).toBeTruthy();
      expect(data).toMatchObject(obj);
    });

    test("Should return 400 a note if valid note_id and invalid user_name have been provided", async () => {
      try {
        const { note_id } = note;
        const obj = {
          user_name: 1
        };
        await axios.patch(`${domain}/${note_id}`, obj);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/user_name/));
      }
    });

    test("Should return 400 a note if valid note_id and invalid text have been provided", async () => {
      try {
        const { note_id } = note;
        const obj = {
          text: 1
        };
        await axios.patch(`${domain}/${note_id}`, obj);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/text/));
      }
    });

    test("Should return 400 a note if valid note_id and invalid email have been provided", async () => {
      try {
        const { note_id } = note;
        await axios.patch(`${domain}/${note_id}`, { email: "testando" });
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(400);
        expect(data.error).toEqual("ValidationError");
        expect(data.message).toEqual(expect.stringMatching(/email/));
      }
    });

    test("Should return 404 if invalid note_id has been provided", async () => {
      try {
        const note_id = 1;
        await axios.patch(`${domain}/${note_id}`, noteUpdate);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(404);
        expect(data.error).toEqual("NotFoundError");
        expect(data.message).toEqual(
          expect.stringMatching(/Note not found by note_id passed/)
        );
      }
    });
  });

  describe("DELETE /note/{note_id}", () => {
    beforeAll(async () => {
      jest.setTimeout(30000);
      note = mockNoteComplete();

      await dynamodb
        .put({
          TableName: tableName,
          Item: note
        })
        .promise();
    });

    afterAll(async () => {});

    test("Should delete a note if valid note_id has been provided", async () => {
      const { note_id } = note;
      const { status, data } = await axios.delete(`${domain}/${note_id}`);
      expect(status).toBe(200);

      expect(data).toBeTruthy();
      expect(data.message).toEqual(expect.stringMatching(/Remove note/));
    });

    test("Should return 404 if invalid note_id has been provided", async () => {
      try {
        const note_id = "1";
        await axios.get(`${domain}/${note_id}`);
      } catch (err) {
        const { status, data } = err.response;
        expect(status).toBe(404);
        expect(data.error).toEqual("NotFoundError");
        expect(data.message).toEqual(
          expect.stringMatching(/Note not found by note_id passed/)
        );
      }
    });
  });
});

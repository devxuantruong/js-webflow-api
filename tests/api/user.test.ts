import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { UserFixture } from "../fixtures";
import { User } from "../../src/api";

describe("Users", () => {
  const mock = new MockAdapter(axios);
  const client = axios.create();

  describe("Static Methods", () => {
    it("should respond with a list of users", async () => {
      const { response, parameters } = UserFixture.list;
      const { siteId } = parameters;
      const path = `/sites/${siteId}/users`;

      mock.onGet(path).reply(200, response);
      const { data } = await User.list(parameters, client);

      expect(data).toBeDefined();
      expect(data.users.length).toBe(response.users.length);
      expect(data.users[0]).toMatchObject(response.users[0]);
    });

    it("should respond with a single user", async () => {
      const { response, parameters } = UserFixture.getOne;
      const { siteId, userId } = parameters;
      const path = `/sites/${siteId}/users/${userId}`;

      mock.onGet(path).reply(200, response);
      const { data } = await User.getOne(parameters, client);

      expect(data).toBeDefined();
      expect(data._id).toBe(response._id);
    });

    it("should invite a user", async () => {
      const { response, parameters } = UserFixture.invite;
      const { siteId } = parameters;
      const path = `/sites/${siteId}/users/invite`;

      mock.onPost(path).reply(200, response);
      const { data } = await User.invite(parameters, client);

      expect(data).toBeDefined();
      expect(data.data).toBeDefined();
      expect(data._id).toBe(response._id);
      expect(data.data).toMatchObject(response.data);
    });

    it("should update a user", async () => {
      const { response, parameters } = UserFixture.update;
      const { siteId, userId } = parameters;
      const path = `/sites/${siteId}/users/${userId}`;

      mock.onPatch(path).reply(200, response);
      const { data } = await User.update(parameters, client);

      expect(data).toBeDefined();
      expect(data._id).toBe(response._id);
      expect(data.data).toBeDefined();
      expect(data.data).toMatchObject(response.data);
    });

    it("should remove a user", async () => {
      const { response, parameters } = UserFixture.delete;
      const { siteId, userId } = parameters;
      const path = `/sites/${siteId}/users/${userId}`;

      mock.onDelete(path).reply(200, response);
      const { data } = await User.remove(parameters, client);

      expect(data).toBeDefined();
      expect(data.deleted).toBe(response.deleted);
    });

    it("should respond with a list of access groups", async () => {
      const { response, parameters } = UserFixture.accessGroups;
      const { siteId } = parameters;
      const path = `/sites/${siteId}/accessgroups`;

      mock.onGet(path).reply(200, response);
      const { data } = await User.accessGroups(parameters, client);

      expect(data).toBeDefined();
      expect(data.accessGroups.length).toBe(response.accessGroups.length);
      expect(data.accessGroups[0]).toMatchObject(response.accessGroups[0]);
    });
  });

  describe("Instance Methods", () => {
    const { parameters, response } = UserFixture.getOne;
    const res = {
      data: {},
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };
    const user = new User(client, res, response, { siteId: parameters.siteId });

    it("should update a user", async () => {
      const { response, parameters } = UserFixture.update;
      const { siteId, userId, data } = parameters;

      const path = `/sites/${siteId}/users/${userId}`;
      mock.onPatch(path).reply(200, response);
      const spy = jest.spyOn(User, "update");

      const result = await user.update(data);

      const _params = { data, siteId, userId };
      expect(spy).toHaveBeenCalledWith(_params, client);

      expect(result).toBeDefined();
      expect(result._id).toBe(response._id);

      expect(result.data).toBeDefined();

      // user wrapper functions
      expect(typeof result.update).toBe("function");
      expect(typeof result.remove).toBe("function");
    });

    it("should remove a user", async () => {
      const { response, parameters } = UserFixture.delete;
      const { siteId, userId } = parameters;

      const path = `/sites/${siteId}/users/${userId}`;
      mock.onDelete(path).reply(200, response);
      const spy = jest.spyOn(User, "remove");

      const result = await user.remove();

      expect(spy).toHaveBeenCalledWith({ siteId, userId }, client);

      expect(result).toBeDefined();
    });
  });
});

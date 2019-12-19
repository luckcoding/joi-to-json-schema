import { ServerClient } from '../src';

const config = {
    middlewares: [],
    effects: []
};

test('should listen and close success', async () => {
    await expect(ServerClient.create(config)).resolves.toBeUndefined()
    await expect(ServerClient.close()).resolves.toBeUndefined()
});

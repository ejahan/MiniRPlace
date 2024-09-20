import { Response } from 'fets';
import { router } from '../lib/server.js';

const TIME_LIMIT = 5000;
const WIDTH = 20;
const HEIGHT = 20;

type User = {
  ip: string;
  last_time: number;
};

let canvas: string[][] = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill('#f7f7f7'));
let users: User[] = [];

router.route({
  path: '/canvas',
  method: 'GET',
  schemas: {
    responses: {
      200: {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      } as const
    }
  },
  handler() {
    return Response.json(canvas);
  }
});


router.route({
    path: '/update-color',
    method: 'POST',
    async handler(req) {
        const body = await req.json();

        if (typeof body.time !== 'number' || typeof body.ip !== 'string' || typeof body.row !== 'number' || typeof body.col !== 'number' || typeof body.color !== 'string') {
            return Response.json({ success: false, message: 'Invalid parameters' });
        }
        if (body.row < 0 || body.row >= HEIGHT || body.col < 0 || body.col >= WIDTH || !/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
            return Response.json({ success: false });
        }

        const user = users.find(users => users.ip == body.ip);
        if (user) {
          let time = body.time - user.last_time;
          if (time < TIME_LIMIT)
            return Response.json({ success: false, message: 'Time limit' });
          user.last_time = body.time;
        }
        else {
          users.push({ip: body.ip, last_time: body.time});
        }
        canvas[body.row][body.col] = body.color;

        return Response.json({ success: true });
    }
});
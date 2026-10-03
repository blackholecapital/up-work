import { createHmac, timingSafeEqual } from 'node:crypto';
export interface Session { tenant: string; owner: string; expires: number; csrf: string }
export class Auth {
  constructor(private secret: string, private origin: string) {}
  issue(session: Session): string {
    const body = Buffer.from(JSON.stringify(session)).toString('base64url');
    return body + '.' + createHmac('sha256', this.secret).update(body).digest('hex');
  }
  read(token: string, now: number): Session {
    const [body, signature] = token.split('.');
    const expected = createHmac('sha256', this.secret).update(body).digest('hex');
    if (!signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('invalid session');
    const session: Session = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (session.expires <= now || !session.tenant || !session.owner) throw new Error('expired session');
    return session;
  }
  mutate(token: string, now: number, origin: string, csrf: string): Session {
    const session = this.read(token, now);
    if (origin !== this.origin || csrf !== session.csrf) throw new Error('mutation denied');
    return session;
  }
}

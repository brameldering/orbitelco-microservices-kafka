import request from 'supertest';
import { app } from '../../app';
import { CUST_TEST_EMAIL, CUST_TEST_ROLE } from '@orbitelco/common';
import { signupCustomer } from '../../test/helper-functions';
import { CURRENT_USER_URL } from '../../constants';

describe('Test current-user', () => {
  it('responds with detail about the current user', async () => {
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    const res = await request(app)
      .get(CURRENT_USER_URL)
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(res.body.currentUser.email).toEqual(CUST_TEST_EMAIL);
    expect(res.body.currentUser.role).toEqual(CUST_TEST_ROLE);
  });
  it('responds with null when not authenticated', async () => {
    const res = await request(app).get(CURRENT_USER_URL).send({}).expect(200);
    expect(res.body.currentUser).toEqual(null);
  });
});

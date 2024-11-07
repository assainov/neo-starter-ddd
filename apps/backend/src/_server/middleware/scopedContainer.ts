import { UUID } from 'node:crypto';
import { asClass, asValue } from 'awilix';
import { RequestHandler } from 'express';
import { Container } from '@/container';
import { EncryptionService } from '@neo/security/encryptionService';
import JwtTokenService from '@neo/security/jwtTokenService';

const scopedContainer = (container: Container): RequestHandler =>
  (req, _, next) => {
    const scoped = container.createScope();

    scoped.register({
      requestId: asValue((req.id as UUID).toString()),
      encryptionService: asClass(EncryptionService).scoped(),
      tokenService: asClass(JwtTokenService).scoped(),
    });

    req.container = scoped;
    next();
  };

export default scopedContainer;
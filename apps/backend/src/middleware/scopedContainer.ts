import { asValue } from 'awilix';
import { RequestHandler } from 'express';
import { Container } from '@/container';

const scopedContainer = (container: Container): RequestHandler =>
  (req, _, next) => {
    const scoped = container.createScope();

    scoped.register({
      requestId: asValue(req.id.toString()),
    });

    req.container = scoped;
    next();
  };

export default scopedContainer;
import { applyDecorators, Injectable, Scope } from '@nestjs/common';

export const UserServiceDecorator = () =>
    applyDecorators(
        Injectable({ scope: Scope.REQUEST })
    );

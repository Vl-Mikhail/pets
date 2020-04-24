import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from "graphql";

export class Email {
  constructor(name) {
    this.name = name;
  }
  name: string
}

@Scalar('Email', type => Email)
export class EmailScalar implements CustomScalar<string, Email> {
  description = 'Email custom scalar type';

  parseValue(value: string): Email {
    // return value; // value from the client
    return new Email(value);
  }

  serialize(value: Email): string {
    return value.name; // value sent to the client
  }

  parseLiteral(ast: ValueNode): Email {
    if (ast.kind === Kind.STRING) {
      return new Email(ast.value);
    }
    return null;
  }
}
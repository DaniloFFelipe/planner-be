import { Service } from 'typedi'

 
export abstract class CodeGeneratorService {
  abstract generate(): string
}

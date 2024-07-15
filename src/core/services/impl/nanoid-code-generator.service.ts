import { customAlphabet } from 'nanoid'
import { Service } from 'typedi'

import { CodeGeneratorService } from '../code-generator.service'

 
export class NanoIdCodeGeneratorService implements CodeGeneratorService {
  generate() {
    const generator = customAlphabet('1234567890aBCDEFGHIJKLMNOP', 6)
    return generator()
  }
}

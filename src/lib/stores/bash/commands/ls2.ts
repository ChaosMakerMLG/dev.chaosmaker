import type { ICommand } from "../static"
import { cmd_ls } from "./ls"

type LsEntry




export class ls {
    public const ls: ICommand = {
        method: ls.cmd_ls
    }
}
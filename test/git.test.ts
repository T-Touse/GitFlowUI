import {test} from "bun:test";
import { Repository } from "../src/app/Repository";

test("git status",async ()=>{
	const repo = Repository.open("./")
	await repo.open()
	console.log(repo.modifiedFiles)
	repo.close()
})
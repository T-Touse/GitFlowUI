import { useTranslation } from "../window/LanguageProvider"

export function RepoList(){
	const {tl} = useTranslation()
	return (<div className="column repo-search">
		<input type="text" placeholder={tl("search.repo")} />
	</div>)
}
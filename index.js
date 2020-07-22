const core = require('@actions/core');
const github = require('@actions/github');

async function run()
{
	const github_token = core.getInput('github-token', {required: true});
	const version = core.getInput('version', {required: true});
	console.log(`Version: ${version}`);
	
	const octokit = github.getOctokit(github_token);
	const context = github.context;
	
	var tag_exists = false;
	octokit.paginate(octokit.repos.listTags, { ...context.repo },
	(response, done) => 
	{
		if (response.data.find((tag) => tag.name == version))
		{
			tag_exists = true;
			done();
		}
		return response.data;
	});
	
	if(tag_exists)
	{
		console.log('Tag already exists');
	}
	else
	{
		console.log('Creating tag');
		octokit.git.createRef(
		{ 
			...context.repo, 
			ref: `refs/tags/${version}`, 
			sha: context.sha 
		});
	}		
	
	
}

run();
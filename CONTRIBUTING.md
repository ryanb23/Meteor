# Contributing to CollectiveUniversity

## Read this post on Git Commit Messages:
[Git Commit Messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)


<hr>
## Working on GitLab: Issues, Features
**Start each new item worked on by doing a git pull from master**

**Do a git pull prior to git push**

If working on an ISSUE, use the gitlab button located on the issue's page, it's called:
*[NEW BRANCH]*, to create a new branch based on it, for this example, the issue 
would be titled, "34-course-builder-test-incorrect-validation-message-is-shown"

After clicking that button, go into your repo and do a 
```bash
git pull
```

Youll see in the pull some text like:

```
remote: Counting objects: 1, done.
remote: Total 1 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (1/1), done.
From gitlab.com:nsardo/collective-university-master
   8e1d4c5..fa9b05c  master     -> origin/master
 * [new branch]      34-course-builder-test-incorrect-validation-message-is-shown
 ...
```

**NOTE** the * [new branch]. 
Now, on your command line, you would enter:

```
git checkout 34-course-builder-test-incorrect-validation-message-is-shown
```

This places you in the new branch, ready to do your work.

**After** completing your work, enter
```
git pull
git push
```


<hr>
## Working on a Bug or Feature **not** in the Issue Tracker
If you are working on something for which there is **not** a GitLab issue:
```bash
git pull
git checkout -b <descriptive branch name>
```
where <descriptive branch name> is a **descriptive** name for what you are doing.


## **ALWAYS**
**Start with**:
```
git pull
```
**Finish with**:
```
git pull
git push
```

- Create a **separate branch** for **each** *feature/bugfix* worked on:

- Make good, understandable commit messages.

- When finished, submit a pull-request: (from the branch you're working on):
    ```bash
    git pull
    git push
    ```
   

<hr>   
## General Procedures:
The following excerpt from Gitlab flow should be observed:
> If you work on a feature branch for more than a few hours it is good to share the intermediate result with the rest of the team. This can be done by creating a merge request without assigning it to anyone, instead you mention people in the description or a comment (/cc @mark @susan). This means it is not ready to be merged but feedback is welcome. Your team members can comment on the merge request in general or on specific lines with line comments. The merge requests serves as a code review tool and no separate tools such as Gerrit and reviewboard should be needed. If the review reveals shortcomings anyone can commit and push a fix. Commonly the person to do this is the creator of the merge/pull request. The diff in the merge/pull requests automatically updates when new commits are pushed on the branch.
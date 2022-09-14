<script lang="ts">
	import CollectionList from './components/CollectionList.svelte';
  import RequestWorkspace from './components/RequestWorkspace.svelte';
  import ResponseWorkspace from './components/ResponseWorkspace.svelte';

  let response;
</script>

<main>
  <div id="collection-list">
    <CollectionList/>
  </div>
  <div id="workspace">
    <div id="request-workspace" class='workspace-wrapper'>
      <RequestWorkspace bind:responseBody={response}/>
    </div>
    <div id="response-workspace" class='workspace-wrapper'>
      <ResponseWorkspace responseBody={response}/>
    </div>
  </div>
</main>

<style>
  main {
    height: 100vh;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  #collection-list {
    width: 30vw;
    height: 100vh;
    background-color: #302F4D;
  }

  #workspace {
    width: 70vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .workspace-wrapper {
    width: 100%;
    height: 50vh;
    display: flex;
    flex-direction: column;
  }

  #request-workspace {
    background-color: #B98EA7;
  }

  #response-workspace {
    background-color: #A57982;
  }
</style>

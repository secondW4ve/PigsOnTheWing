<script lang="ts">
  import { RequestSettingTabs } from './../constants/request-settings';
  import { restService } from '../services/rest.service';
	import { callTypes } from './../constants/call-types';
	import Button from './Button.svelte';
  import { JSONEditor, Mode } from 'svelte-jsoneditor';
  import SvelteTable from 'svelte-table';

  export let responseBody;

  const rows: any = [
    {
      key: 'Auth',
      value: 'Basic 123'
    }
  ];
  const columns: any = [
    {
      key: 'key',
      title: 'KEY',
      value: v => v.key,
    },
    {
      key: 'value',
      title: 'VALUE',
      value: v => v.value
    }
  ];
  let refJsonEditor;
  let requestBody = {
    json: {}
  };

  let url;
  let method;
  let requestSettingTabToDisplay = RequestSettingTabs.HEADERS;

  const changeTab = (tab: RequestSettingTabs) => {
    requestSettingTabToDisplay = tab;
  }

  const handleSendClick = async () => {
    console.log('Sending...');
    console.log(url);
    console.log(method);
    responseBody = await restService.doGet(url);
  }

  const handleRenderMenu = (mode, items) => {
    console.log(mode);
    console.log(items);
    console.log(refJsonEditor)
  }

  console.log(refJsonEditor)
</script>

<div class='content-layout'>
  <div class='inputs'>
    <select bind:value={method}>
      {#each callTypes as callType }
        <option value="{callType.value}">{callType.label}</option>
      {/each}
    </select>
    <input bind:value={url}/>
    <Button
      label='Send'
      width='100px'
      height='40px'
      onClick={handleSendClick}
    />
  </div>
  <div id="request-settings">
    <div class="tabs">
      <button class="tab-link" on:click={() => changeTab(RequestSettingTabs.HEADERS)}>Headers</button>
      <button class="tab-link" on:click={() => changeTab(RequestSettingTabs.BODY)}>Body</button>
    </div>
  
    {#if requestSettingTabToDisplay === RequestSettingTabs.HEADERS}
      <div id="headers" class="tab-content">
        <SvelteTable rows = {rows} columns = {columns}/>
      </div>
    {:else if requestSettingTabToDisplay === RequestSettingTabs.BODY}
      <div id="request-body" class="tab-content">
        <JSONEditor
          mainMenuBar={false}
          navigationBar={false}
          mode={Mode.text}
          bind:content = {requestBody}
          onRenderMenu={handleRenderMenu}
          bind:this = {refJsonEditor}
        />
      </div>
    {/if}
  </div>
</div>

<style>

  .content-layout {
    height: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
  }

  .inputs {
    height: 50px;
  }

  .tabs {
    border: 1px solid;
    overflow: hidden;
  }

  .tabs button {
    float: left;
    background-color: inherit;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 0.1s;
    font-size: 16px;
    padding: 10px 12px;
  }

  .tabs button:hover {
    background-color: #ddd;
  }

  #request-settings {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .tab-content {
    flex-grow: 1;
  }
</style>

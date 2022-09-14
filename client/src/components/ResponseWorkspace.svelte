<script lang="ts">
  export let responseBody = '';
</script>

<div class='content'>
  <textarea
    value={JSON.stringify(responseBody)}
  ></textarea>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    padding: 15px;
  }


</style>
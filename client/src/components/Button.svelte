<script lang="ts">
  export let label = 'Button';
  export let height = '20px';
  export let width = '30px';
  export let onClick;
</script>

<button
  on:click={onClick}
  style="--width: {width}; --height: {height}"
>
  {label}
</button>

<style>
  button {
    background-color: pink;
    width: var(--width);
    height: var(--height);
    border-radius: 20px;
    border-width: 1px;
    border-color: black;
  }
</style>
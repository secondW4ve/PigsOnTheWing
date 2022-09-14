<script lang="ts">
  import TopAppBar, { Row, Title } from '@smui/top-app-bar';
  import Button, { Label } from '@smui/button';
  import Section from '@smui/top-app-bar/src/Section.svelte';
  import Textfield from '@smui/textfield';
</script>

<div id='root'>
  <TopAppBar
    variant="static"
  >
    <Row>
      <Section>
        <Title>Pigs on the Wing</Title>
      </Section>
      <Section align="end">
        <Button>
        </Button>
      </Section>
    </Row>
  </TopAppBar>
  <Textfield
    type='password'
  ></Textfield>
</div>

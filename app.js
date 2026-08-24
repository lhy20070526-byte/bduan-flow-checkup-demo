(function () {
  const form = document.querySelector('#intake-form');
  const output = document.querySelector('#brief-output');
  const copyButton = document.querySelector('#copy-brief');
  const downloadButton = document.querySelector('#download-brief');
  const resetButton = document.querySelector('#reset-form');
  const nextStep = document.querySelector('#next-step');
  const formActions = document.querySelector('.form-actions');
  const demoToggle = document.querySelector('#demo-toggle');
  const demoOutput = document.querySelector('#demo-output');
  let latestBrief = '';

  if (!form || !output || !copyButton || !downloadButton || !resetButton || !nextStep || !formActions) return;

  const value = (id) => document.querySelector(`#${id}`).value.trim();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const team = value('team');
    const interest = value('interest');
    const workflow = value('workflow');
    const tools = value('tools');
    const goal = value('goal');
    const contact = value('contact') || '暂不留下';

    if (!team || !workflow || !tools || !goal) {
      form.reportValidity();
      return;
    }

    latestBrief = [
      '【流程体检室｜需求摘要】',
      `想先了解：${interest}`,
      `团队规模：${team}`,
      `想改流程：${workflow}`,
      `现有工具：${tools}`,
      `期待结果：${goal}`,
      `联系方式：${contact}`,
      '',
      '建议下一步：先用 90 分钟梳理输入、判断、输出和人工确认点，再决定是否进入单流程试点。',
      '说明：这份摘要只在当前浏览器生成，尚未发送给任何人。'
    ].join('\n');

    output.textContent = latestBrief;
    output.hidden = false;
    nextStep.hidden = false;
    formActions.hidden = false;
    copyButton.focus();
  });

  copyButton.addEventListener('click', async () => {
    if (!latestBrief) return;
    try {
      await navigator.clipboard.writeText(latestBrief);
      copyButton.textContent = '已复制摘要';
    } catch (error) {
      const helper = document.createElement('textarea');
      helper.value = latestBrief;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
      copyButton.textContent = '已复制摘要';
    }
    window.setTimeout(() => { copyButton.textContent = '复制摘要'; }, 1800);
  });

  downloadButton.addEventListener('click', () => {
    if (!latestBrief) return;
    const blob = new Blob([latestBrief], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '流程体检需求摘要.txt';
    link.click();
    URL.revokeObjectURL(url);
    downloadButton.textContent = '已下载摘要';
    window.setTimeout(() => { downloadButton.textContent = '下载摘要'; }, 1800);
  });

  resetButton.addEventListener('click', () => {
    form.reset();
    latestBrief = '';
    output.textContent = '';
    output.hidden = true;
    nextStep.hidden = true;
    formActions.hidden = true;
    document.querySelector('#interest').focus();
  });

  if (demoToggle && demoOutput) {
    demoToggle.addEventListener('click', () => {
      const isHidden = demoOutput.hidden;
      demoOutput.hidden = !isHidden;
      const isExpanded = !demoOutput.hidden;
      demoToggle.setAttribute('aria-expanded', String(isExpanded));
      demoToggle.innerHTML = isExpanded ? '收起匿名输出 <span>↗</span>' : '查看匿名输出 <span>↘</span>';
    });
  }
})();

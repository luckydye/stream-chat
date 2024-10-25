export function parseTwitchIRCMessage(message) {
  const result = {
    tags: {},
    prefix: null,
    command: null,
    params: [],
    trailing: null
  };

  let i = 0;

  // Step 1: Parse tags if they exist (start with '@')
  if (message[i] === '@') {
    const tagsEnd = message.indexOf(' ', i);
    const tagsStr = message.slice(1, tagsEnd);
    tagsStr.split(';').forEach(tag => {
      const [key, value] = tag.split('=');
      result.tags[key] = value || null;
    });
    i = tagsEnd + 1;
  }

  // Step 2: Parse prefix if it exists (starts with ':')
  if (message[i] === ':') {
    const prefixEnd = message.indexOf(' ', i);
    result.prefix = message.slice(i + 1, prefixEnd);
    i = prefixEnd + 1;
  }

  // Step 3: Parse command
  const commandEnd = message.indexOf(' ', i);
  if (commandEnd !== -1) {
    result.command = message.slice(i, commandEnd);
    i = commandEnd + 1;
  } else {
    result.command = message.slice(i);
    return result;
  }

  // Step 4: Parse parameters and trailing message
  while (i < message.length) {
    if (message[i] === ':') {
      result.trailing = message.slice(i + 1).trim();
      break;
    }

    const paramEnd = message.indexOf(' ', i);
    if (paramEnd === -1) {
      result.params.push(message.slice(i).trim());
      break;
    } else {
      result.params.push(message.slice(i, paramEnd));
      i = paramEnd + 1;
    }
  }

  return result;
}

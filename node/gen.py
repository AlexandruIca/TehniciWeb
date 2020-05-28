import io

i = 0

with io.open('./data.json', mode='r', encoding='utf-8') as f:
    for line in f:
        prev = 0;
        pos = line.find("event")

        while True:
            print(repr(line[prev:pos].encode('utf-8'))[2:-1], end='')
            print(repr(f"event{i}".encode('utf-8'))[2:-1], end='"')
            i += 1
            prev = pos + 6
            pos = line.find("event", prev)

            if pos <= 31:
                print(repr(line[prev:].encode('utf-8'))[2:-1])
                break

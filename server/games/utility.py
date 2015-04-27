from itertools import permutations

def flatten_pair(pair):
    return 3*pair[0] + pair[1]

def flatten(inflated_sequence):
    return [flatten_pair(pair) for pair in inflated_sequence]

def inflate_pair(pair):
    return [pair / 3, pair % 3]

def inflate(flattened_sequence):
    return [inflate_pair(item) for item in flattened_sequence]

def get_sequences():
    return list(permutations(range(9)))

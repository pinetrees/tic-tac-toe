from itertools import permutations

def flatten_pair(pair):
    return 3*pair[0] + pair[1]

def flatten(inflated_sequence):
    return [flatten_pair(pair) for pair in inflated_sequence]

def inflate(flattened_sequence):
    return [[item / 3, item % 3] for item in flattened_sequence]

def get_sequences():
    return list(permutations(range(9)))

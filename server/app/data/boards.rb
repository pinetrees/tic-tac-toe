rows = 3
cells = 3
#[empty, player 1, player 2]
states = [0 , 1, 2]
puts rows

rows.times do |i|
    puts i
    cells.times do |j|
        puts j
        states.each { |k| puts k }
    end
end

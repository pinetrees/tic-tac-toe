class Game < ActiveRecord::Base
    def tuples
        [
            [self.a, self.b, self.c],
            [self.d, self.e, self.f],
            [self.g, self.h, self.i],
            [self.a, self.d, self.g],
            [self.b, self.e, self.h],
            [self.c, self.f, self.i],
            [self.a, self.e, self.i],
            [self.g, self.e, self.c],
        ]
    end
    def check
        for tuple in self.tuples
            if tuple.uniq.length == 1
                if tuple[0] != 0
                    self.is_complete = true;
                    self.save()
                    return tuple[0]
                end
            end
            return 0
        end
    end
end

# Usage: ./run_test.sh {test_folder}
[ ! $1 ] || [ ! -d $1 ] && echo "Test dir $1 does not exist" && exit 1
[ -x "$(artillery -V)" ] && echo "Requires npm artillery" && exit 1
RUN=$1-$(date +%s)
echo "$RUN running"
artillery run $1/test_config.yml > results/$RUN.txt
echo "$RUN done"
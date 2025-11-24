
## 📄 **文件2：database/setup_database.sh**（独立文件）

```bash
#!/bin/bash

# LearnSync 数据库设置脚本
# 文件名: setup_database.sh
# 描述: 自动设置数据库和导入初始数据
# 用法: ./setup_database.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 MySQL 客户端
check_mysql_client() {
    if ! command -v mysql &> /dev/null; then
        log_error "MySQL 客户端未安装，请先安装 MySQL"
        exit 1
    fi
    log_info "MySQL 客户端检查通过"
}

# 读取数据库配置
read_db_config() {
    if [ -f "../backend/.env" ]; then
        source "../backend/.env"
    else
        log_warn "未找到 .env 文件，使用默认配置"
        DB_HOST="localhost"
        DB_USER="root"
        DB_PASSWORD=""
        DB_NAME="learnsync_dev"
    fi
}

# 测试数据库连接
test_db_connection() {
    log_info "测试数据库连接..."
    if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
        log_info "数据库连接成功"
    else
        log_error "数据库连接失败，请检查配置"
        exit 1
    fi
}

# 创建数据库
create_database() {
    log_info "创建数据库: $DB_NAME"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;"
}

# 运行迁移脚本
run_migrations() {
    log_info "运行数据库迁移..."
    
    for migration_file in migrations/*.sql; do
        if [ -f "$migration_file" ]; then
            log_info "执行迁移: $(basename "$migration_file")"
            mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$migration_file"
        fi
    done
}

# 运行种子脚本
run_seeds() {
    log_info "插入测试数据..."
    
    for seed_file in seeds/*.sql; do
        if [ -f "$seed_file" ]; then
            log_info "执行种子: $(basename "$seed_file")"
            mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$seed_file"
        fi
    done
}

# 验证设置
verify_setup() {
    log_info "验证数据库设置..."
    
    table_count=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';")
    user_count=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM users;")
    
    log_info "数据库表数量: $table_count"
    log_info "测试用户数量: $user_count"
    
    if [ "$user_count" -gt 0 ]; then
        log_info "✅ 数据库设置完成"
    else
        log_error "❌ 数据库设置失败"
        exit 1
    fi
}

# 显示使用信息
show_usage() {
    log_info "LearnSync 数据库设置脚本"
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  -h, --help    显示帮助信息"
    echo "  -c, --clean   清理并重新创建数据库"
    echo "  -s, --skip-seeds 跳过测试数据插入"
}

# 清理数据库
clean_database() {
    log_warn "清理数据库: $DB_NAME"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "DROP DATABASE IF EXISTS $DB_NAME;"
}

# 主函数
main() {
    local skip_seeds=false
    local clean_db=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -c|--clean)
                clean_db=true
                shift
                ;;
            -s|--skip-seeds)
                skip_seeds=true
                shift
                ;;
            *)
                log_error "未知参数: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    log_info "开始设置 LearnSync 数据库..."
    
    check_mysql_client
    read_db_config
    test_db_connection
    
    if [ "$clean_db" = true ]; then
        clean_database
    fi
    
    create_database
    run_migrations
    
    if [ "$skip_seeds" = false ]; then
        run_seeds
    else
        log_info "跳过测试数据插入"
    fi
    
    verify_setup
    
    log_info "🎉 数据库设置完成！"
    log_info "📊 数据库: $DB_NAME"
    log_info "🌐 主机: $DB_HOST"
    log_info "👤 用户: $DB_USER"
    
    if [ "$skip_seeds" = false ]; then
        log_info "测试用户信息:"
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT username, email FROM users ORDER BY id;"
    fi
}

# 运行主函数
main "$@"
